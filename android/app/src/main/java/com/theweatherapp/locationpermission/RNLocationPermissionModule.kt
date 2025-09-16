package com.theweatherapp.locationpermission

import android.Manifest
import android.app.Activity
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.location.LocationManager
import android.net.Uri
import android.os.Build
import android.provider.Settings
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.modules.core.PermissionAwareActivity
import com.facebook.react.modules.core.PermissionListener

@ReactModule(name = RNLocationPermissionModule.NAME)
class RNLocationPermissionModule(
  private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext), PermissionListener {

  companion object {
    const val NAME = "RNLocationPermission"
    private const val REQUEST_FOREGROUND = 10101
    private const val REQUEST_BACKGROUND = 10102
  }

  private enum class RequestType { FOREGROUND, BACKGROUND }

  private val prefs = reactContext.getSharedPreferences("rn_location_permission", Context.MODE_PRIVATE)
  private var pendingPromise: Promise? = null
  private var pendingRequest: RequestType? = null

  override fun getName(): String = NAME

  @ReactMethod
  fun checkStatus(promise: Promise) {
    promise.resolve(buildStatus())
  }

  @ReactMethod
  fun requestWhenInUse(promise: Promise) {
    if (hasForegroundPermission()) {
      promise.resolve(buildStatus())
      return
    }

    requestPermissions(
      arrayOf(
        Manifest.permission.ACCESS_FINE_LOCATION,
        Manifest.permission.ACCESS_COARSE_LOCATION
      ),
      RequestType.FOREGROUND,
      REQUEST_FOREGROUND,
      promise
    )
  }

  @ReactMethod
  fun requestBackground(promise: Promise) {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
      // Background permission does not exist before Android 10
      promise.resolve(buildStatus())
      return
    }

    if (hasBackgroundPermission()) {
      promise.resolve(buildStatus())
      return
    }

    requestPermissions(
      arrayOf(Manifest.permission.ACCESS_BACKGROUND_LOCATION),
      RequestType.BACKGROUND,
      REQUEST_BACKGROUND,
      promise
    )
  }

  @ReactMethod
  fun isLocationEnabled(promise: Promise) {
    val locationManager = reactContext.getSystemService(LocationManager::class.java)
    val enabled = if (locationManager != null) {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
        locationManager.isLocationEnabled
      } else {
        locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER) ||
          locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER)
      }
    } else {
      false
    }

    promise.resolve(enabled)
  }

  @ReactMethod
  fun openSettings(promise: Promise) {
    try {
      val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS)
      intent.data = Uri.fromParts("package", reactContext.packageName, null)
      intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      reactContext.startActivity(intent)
      promise.resolve(null)
    } catch (t: Throwable) {
      promise.reject("E_OPEN_SETTINGS", "Unable to open settings", t)
    }
  }

  override fun onRequestPermissionsResult(
    requestCode: Int,
    permissions: Array<String>,
    grantResults: IntArray
  ): Boolean {
    val promise = pendingPromise ?: return false
    val requestType = pendingRequest
    pendingPromise = null
    pendingRequest = null

    val granted = grantResults.isNotEmpty() && grantResults.all { it == PackageManager.PERMISSION_GRANTED }

    if (granted) {
      promise.resolve(buildStatus())
    } else {
      if (requestType == RequestType.BACKGROUND) {
        promise.resolve(buildStatus())
      } else {
        val blocked = isPermissionBlocked(permissions)
        promise.resolve(
          createStatus(
            state = if (blocked) "blocked" else "denied",
            accuracy = "unknown",
            scope = "none"
          )
        )
      }
    }

    return true
  }

  private fun requestPermissions(
    permissions: Array<String>,
    requestType: RequestType,
    requestCode: Int,
    promise: Promise
  ) {
    if (pendingPromise != null) {
      promise.reject("E_IN_PROGRESS", "Another permission request is already in progress")
      return
    }

    val activity = currentActivity
    if (activity == null) {
      promise.reject("E_ACTIVITY", "Activity is null")
      return
    }

    val permissionAware = activity as? PermissionAwareActivity
    if (permissionAware == null) {
      promise.reject("E_ACTIVITY", "Activity does not implement PermissionAwareActivity")
      return
    }

    pendingPromise = promise
    pendingRequest = requestType
    when (requestType) {
      RequestType.FOREGROUND -> prefs.edit().putBoolean("foreground_requested", true).apply()
      RequestType.BACKGROUND -> prefs.edit().putBoolean("background_requested", true).apply()
    }
    permissionAware.requestPermissions(permissions, requestCode, this)
  }

  private fun buildStatus(): WritableMap {
    val hasForeground = hasForegroundPermission()
    val hasBackground = hasBackgroundPermission()
    val requestedForeground = prefs.getBoolean("foreground_requested", false)
    val state = when {
      hasForeground -> "granted"
      requestedForeground && isPermissionBlocked(arrayOf(Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION)) -> "blocked"
      else -> "denied"
    }

    val scope = when {
      hasBackground -> "always"
      hasForeground -> "whenInUse"
      else -> "none"
    }

    val accuracy = if (hasFinePermission()) {
      "full"
    } else if (hasCoarsePermission()) {
      "reduced"
    } else {
      "unknown"
    }

    val map = createStatus(state, accuracy, scope)
    return map
  }

  private fun createStatus(state: String, accuracy: String, scope: String): WritableMap {
    val map = Arguments.createMap()
    map.putString("state", state)
    map.putString("accuracy", accuracy)
    map.putString("scope", scope)
    return map
  }

  private fun hasFinePermission(): Boolean =
    ContextCompat.checkSelfPermission(
      reactContext,
      Manifest.permission.ACCESS_FINE_LOCATION
    ) == PackageManager.PERMISSION_GRANTED

  private fun hasCoarsePermission(): Boolean =
    ContextCompat.checkSelfPermission(
      reactContext,
      Manifest.permission.ACCESS_COARSE_LOCATION
    ) == PackageManager.PERMISSION_GRANTED

  private fun hasBackgroundPermission(): Boolean {
    return if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
      hasForegroundPermission()
    } else {
      ContextCompat.checkSelfPermission(
        reactContext,
        Manifest.permission.ACCESS_BACKGROUND_LOCATION
      ) == PackageManager.PERMISSION_GRANTED
    }
  }

  private fun hasForegroundPermission(): Boolean = hasFinePermission() || hasCoarsePermission()

  private fun isPermissionBlocked(permissions: Array<out String>): Boolean {
    val activity: Activity = currentActivity ?: return false

    for (permission in permissions) {
      if (ContextCompat.checkSelfPermission(reactContext, permission) == PackageManager.PERMISSION_GRANTED) {
        return false
      }

      if (ActivityCompat.shouldShowRequestPermissionRationale(activity, permission)) {
        return false
      }
    }

    return true
  }
}
