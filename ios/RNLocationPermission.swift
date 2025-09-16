import Foundation
import CoreLocation
import UIKit
import React

@objc(RNLocationPermission)
class RNLocationPermission: NSObject, RCTBridgeModule, CLLocationManagerDelegate {
  private var locationManager: CLLocationManager?
  private var pendingResolve: RCTPromiseResolveBlock?

  private enum RequestType {
    case whenInUse
    case always
  }

  private var pendingRequest: RequestType?

  @objc static func moduleName() -> String! {
    return "RNLocationPermission"
  }

  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }

  @objc func checkStatus(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      resolve(self.buildStatus())
    }
  }

  @objc func requestWhenInUse(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      guard CLLocationManager.locationServicesEnabled() else {
        resolve(self.buildStatus())
        return
      }

      let status = CLLocationManager.authorizationStatus()
      if status == .authorizedWhenInUse || status == .authorizedAlways {
        resolve(self.buildStatus())
        return
      }

      if self.pendingResolve != nil {
        reject("E_IN_PROGRESS", "Another permission request is in progress", nil)
        return
      }

      self.startRequest(type: .whenInUse, resolve: resolve, reject: reject)
      self.ensureManager().requestWhenInUseAuthorization()
    }
  }

  @objc func requestBackground(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      guard CLLocationManager.locationServicesEnabled() else {
        resolve(self.buildStatus())
        return
      }

      let status = CLLocationManager.authorizationStatus()
      if status == .authorizedAlways {
        resolve(self.buildStatus())
        return
      }

      if self.pendingResolve != nil {
        reject("E_IN_PROGRESS", "Another permission request is in progress", nil)
        return
      }

      self.startRequest(type: .always, resolve: resolve, reject: reject)
      self.ensureManager().requestAlwaysAuthorization()
    }
  }

  @objc func isLocationEnabled(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      resolve(CLLocationManager.locationServicesEnabled())
    }
  }

  @objc func openSettings(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      guard let url = URL(string: UIApplication.openSettingsURLString) else {
        reject("E_OPEN_SETTINGS", "Could not build settings URL", nil)
        return
      }

      if UIApplication.shared.canOpenURL(url) {
        UIApplication.shared.open(url, options: [:], completionHandler: nil)
        resolve(nil)
      } else {
        reject("E_OPEN_SETTINGS", "Cannot open settings URL", nil)
      }
    }
  }

  private func ensureManager() -> CLLocationManager {
    if locationManager == nil {
      locationManager = CLLocationManager()
      locationManager?.delegate = self
    }
    return locationManager!
  }

  private func startRequest(type: RequestType, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    pendingRequest = type
    pendingResolve = resolve
    _ = ensureManager()
  }

  private func finishRequest() {
    guard let resolve = pendingResolve else { return }
    pendingResolve = nil
    pendingRequest = nil
    resolve(buildStatus())
  }

  private func buildStatus() -> [String: Any] {
    let servicesEnabled = CLLocationManager.locationServicesEnabled()
    let status = CLLocationManager.authorizationStatus()
    let scope: String
    let state: String

    switch status {
    case .authorizedAlways:
      state = "granted"
      scope = "always"
    case .authorizedWhenInUse:
      state = "granted"
      scope = "whenInUse"
    case .restricted:
      state = "blocked"
      scope = "none"
    case .denied:
      state = "denied"
      scope = "none"
    default:
      state = servicesEnabled ? "denied" : "blocked"
      scope = "none"
    }

    var accuracy = "unknown"
    if #available(iOS 14.0, *) {
      let manager = ensureManager()
      switch manager.accuracyAuthorization {
      case .fullAccuracy:
        accuracy = "full"
      case .reducedAccuracy:
        accuracy = "reduced"
      @unknown default:
        accuracy = "unknown"
      }
    } else {
      accuracy = state == "granted" ? "full" : "unknown"
    }

    return [
      "state": state,
      "accuracy": accuracy,
      "scope": scope
    ]
  }

  private func authorizationDidChange(_ status: CLAuthorizationStatus) {
    if status == .notDetermined {
      return
    }
    finishRequest()
  }

  func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
    authorizationDidChange(status)
  }

  func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
    if #available(iOS 14.0, *) {
      authorizationDidChange(manager.authorizationStatus)
    }
  }
}
