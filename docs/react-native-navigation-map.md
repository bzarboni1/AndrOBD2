# React Native Navigation Map and Screen Parity

## Navigation Tree

- Home
  - Connect
  - DiagnosticsHome
    - Overview tab
    - FreezeFrames tab
    - TestControls tab
  - LiveData
    - Table mode
    - Chart mode
    - Dashboard mode
    - HUD mode
  - Measurements (RecordingLibraryScreen)
  - Settings
  - Plugins

## Legacy-to-RN Parity Matrix

| Legacy Area | RN Screen/Feature | Status |
|---|---|---|
| Connection manager | Home + ConnectScreen | PASS |
| Diagnostics hub | DiagnosticsHomeScreen | PASS |
| Freeze frames | FreezeFramePanel | PASS |
| Test controls | TestControlPanel | PASS |
| Live data table/chart | LiveDataScreen modes | PASS |
| HUD/dashboard | LiveDataHud + LiveDataDashboard | PASS |
| Recording library | RecordingLibraryScreen | PASS |
| Settings | SettingsScreen | PASS |
| Plugin manager | PluginManagerScreen | PASS |
