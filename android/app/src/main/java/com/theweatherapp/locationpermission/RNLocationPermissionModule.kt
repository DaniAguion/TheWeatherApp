package com.theweatherapp.locationpermission

import android.Manifest
import android.app.Activity
import android.content.Intent
import android.location.LocationManager
import android.os.Build
import android.provider.Settings
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import android.content.pm.PackageManager
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.modules.core.PermissionAwareActivity
import com.facebook.react.modules.core.PermissionListener

class RNLocationPermissionModule(private val reactContext: ReactApplicationContext)
  : ReactContextBaseJavaModule(reactContext), PermissionListener {

  override fun getName() = "RNLocationPermission"

  private var pendingPromise: Promise? = null
  private val REQ_CODE_LOCATION = 0xCAFE

  private fun mapState(granted: Boolean, denied: Boolean, blocked: Boolean): String {
    return when {
      granted -> "granted"
      blocked -> "blocked"
      denied  -> "denied"
      else    -> "prompt"
    }
  }

  private fun isGranted(vararg perms: String): Boolean {
    return perms.any { ContextCompat.checkSelfPermission(reactContext, it) == PackageManager.PERMISSION_GRANTED }
  }

  private fun isDenied(vararg perms: String): Boolean {
    return perms.any { ContextCompat.checkSelfPermission(reactContext, it) == PackageManager.PERMISSION_DENIED }
  }

  private fun isBlocked(activity: Activity?, perm: String): Boolean {
    if (activity == null) return false
    val granted = ContextCompat.checkSelfPermission(reactContext, perm) == PackageManager.PERMISSION_GRANTED
    if (granted) return false
    // blocked = !shouldShowRequestPermissionRationale después de haber pedido una vez
    return !ActivityCompat.shouldShowRequestPermissionRationale(activity, perm)
  }

  private fun locationEnabled(): Boolean {
    val lm = reactContext.getSystemService(LocationManager::class.java)
    return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
      lm.isLocationEnabled
    } else {
      val gps = lm.isProviderEnabled(LocationManager.GPS_PROVIDER)
      val net = lm.isProviderEnabled(LocationManager.NETWORK_PROVIDER)
      gps || net
    }
  }

  private fun statusObj(state: String, scope: String, accuracy: String): WritableMap {
    val map = Arguments.createMap()
    map.putString("state", state)
    map.putString("scope", scope)
    map.putString("accuracy", accuracy)
    map.putBoolean("locationEnabled", locationEnabled())
    return map
  }

  @ReactMethod
  fun checkStatus(promise: Promise) {
    val fine = Manifest.permission.ACCESS_FINE_LOCATION
    val coarse = Manifest.permission.ACCESS_COARSE_LOCATION
    val bg = Manifest.permission.ACCESS_BACKGROUND_LOCATION

    val granted = isGranted(fine, coarse)
    val denied = isDenied(fine, coarse)
    val activity = currentActivity

    val blocked = activity?.let { isBlocked(it, fine) || isBlocked(it, coarse) } ?: false

    val state = mapState(granted, denied, blocked)
    val scope = if (Build.VERSION.SDK_INT >= 29 && ContextCompat.checkSelfPermission(reactContext, bg) == PackageManager.PERMISSION_GRANTED && granted) {
      "always"
    } else if (granted) {
      "whenInUse"
    } else {
      "none"
    }

    // Accuracy heurística: FINE => full, COARSE => reduced
    val accuracy = when {
      ContextCompat.checkSelfPermission(reactContext, fine) == PackageManager.PERMISSION_GRANTED -> "full"
      ContextCompat.checkSelfPermission(reactContext, coarse) == PackageManager.PERMISSION_GRANTED -> "reduced"
      else -> "unknown"
    }

    promise.resolve(statusObj(state, scope, accuracy))
  }

  @ReactMethod
  fun requestWhenInUse(promise: Promise) {
    val activity = currentActivity as? PermissionAwareActivity
    if (activity == null) {
      promise.reject("E_NO_ACTIVITY", "No current activity")
      return
    }
    pendingPromise = promise
    activity.requestPermissions(
      arrayOf(
        android.Manifest.permission.ACCESS_FINE_LOCATION,
        android.Manifest.permission.ACCESS_COARSE_LOCATION
      ),
      REQ_CODE_LOCATION,
      this
    )
  }

  @ReactMethod
  fun isLocationEnabled(promise: Promise) {
    promise.resolve(locationEnabled())
  }

  // PermissionListener
  override fun onRequestPermissionsResult(
    requestCode: Int,
    permissions: Array<String>,
    grantResults: IntArray
  ): Boolean {
    if (requestCode != REQ_CODE_LOCATION) return false
    val promise = pendingPromise ?: return false
    pendingPromise = null
    checkStatus(promise)
    return true
  }
}