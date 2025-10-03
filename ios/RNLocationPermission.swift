import Foundation
import CoreLocation
import React
import UIKit

@objc(RNLocationPermission)
class RNLocationPermission: NSObject, CLLocationManagerDelegate {
  private let manager = CLLocationManager()
  private var pendingResolve: (([String: Any]) -> Void)?

  override init() {
    super.init()
    manager.delegate = self
  }

  @objc static func requiresMainQueueSetup() -> Bool { true }

  // Map iOS authorization status to our PermissionState
  private func mapAuth(_ status: CLAuthorizationStatus) -> String {
    switch status {
      case .authorizedWhenInUse: return "granted"
      case .denied: return "denied"
      case .restricted: return "blocked"
      case .notDetermined: return "prompt"
      @unknown default: return "prompt"
    }
  }

  private func accuracyAuth() -> String {
    if #available(iOS 14.0, *) {
      return manager.accuracyAuthorization == .fullAccuracy ? "full" : "reduced"
    }
    return "unknown"
  }

  // Build the status object to return to JS
  private func buildStatus() -> [String: Any] {
    let s: CLAuthorizationStatus = CLLocationManager.authorizationStatus()
    return [
      "state": mapAuth(s),
      "scope": "whenInUse",
      "accuracy": accuracyAuth(),
      "locationEnabled": CLLocationManager.locationServicesEnabled()
    ]
  }

  @objc func checkStatus(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    resolve(buildStatus())
  }

  @objc func requestWhenInUse(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    pendingResolve = resolve
    DispatchQueue.main.async { self.manager.requestWhenInUseAuthorization() }
  }

  @objc func isLocationEnabled(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    resolve(CLLocationManager.locationServicesEnabled())
  }

  // Check if we have a pending resolver and make sure there are not two calls at the same time
  private func resolveIfPending() {
    guard let r = pendingResolve else { return }
    let status = buildStatus()
    pendingResolve = nil
    r(status)
  }

  // iOS 14+
  func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
    resolveIfPending()
  }

  // iOS < 14
  func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
    resolveIfPending()
  }
}
