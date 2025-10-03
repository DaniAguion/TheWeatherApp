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

  // React Native (Swift) necesita esto aunque el shim .m haga el puente
  @objc static func requiresMainQueueSetup() -> Bool { true }

  // MARK: - Helpers

  private func mapAuth(_ status: CLAuthorizationStatus) -> String {
    switch status {
      case .authorizedAlways: return "granted"
      case .authorizedWhenInUse: return "granted"
      case .denied: return "denied"
      case .restricted: return "blocked"
      case .notDetermined: return "prompt"
      @unknown default: return "prompt"
    }
  }

  private func scope(_ status: CLAuthorizationStatus) -> String {
    switch status {
      case .authorizedAlways: return "always"
      case .authorizedWhenInUse: return "whenInUse"
      default: return "none"
    }
  }

  private func accuracyAuth() -> String {
    if #available(iOS 14.0, *) {
      return manager.accuracyAuthorization == .fullAccuracy ? "full" : "reduced"
    }
    return "unknown"
  }

  private func buildStatus() -> [String: Any] {
    let s = CLLocationManager.authorizationStatus()
    return [
      "state": mapAuth(s),
      "scope": scope(s),
      "accuracy": accuracyAuth(),
      "locationEnabled": CLLocationManager.locationServicesEnabled()
    ]
  }

  // MARK: - Exported methods

  @objc func checkStatus(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    resolve(buildStatus())
  }

  @objc func requestWhenInUse(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    pendingResolve = resolve
    DispatchQueue.main.async { self.manager.requestWhenInUseAuthorization() }
  }

  @objc func requestAlways(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    pendingResolve = resolve
    DispatchQueue.main.async { self.manager.requestAlwaysAuthorization() }
  }

  @objc func isLocationEnabled(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    resolve(CLLocationManager.locationServicesEnabled())
  }

  @objc func openSettings(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    guard let url = URL(string: UIApplication.openSettingsURLString) else { resolve(false); return }
    DispatchQueue.main.async { UIApplication.shared.open(url, options: [:]) { ok in resolve(ok) } }
  }

  // MARK: - Delegate

  func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
    if let r = pendingResolve { r(buildStatus()); pendingResolve = nil }
  }

  // iOS < 14
  func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
    if let r = pendingResolve { r(buildStatus()); pendingResolve = nil }
  }
}
