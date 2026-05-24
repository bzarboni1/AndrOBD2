# JS-Native Bridge Mapping

This file tracks implementation mapping between frontend bridge functions and
`specs/001-react-native-modernization/contracts/js-native-bridge-contract.md`.

## Status

- Current state: interface scaffolded in `nativeBridge.ts`
- Next step: map each bridge method to existing Android/library domain services

## Method Coverage Checklist

- [ ] connect
- [ ] disconnect
- [ ] getConnectionState
- [ ] runDiagnosticAction
- [ ] clearFaultCodes
- [ ] startLiveData
- [ ] stopLiveData
- [ ] startRecording
- [ ] stopRecording
- [ ] loadRecording
- [ ] exportRecording
- [ ] getPreferences
- [ ] setPreference
- [ ] listPlugins
- [ ] invokePluginAction
- [ ] buildDemoSamples (frontend demo/live-data helper)
