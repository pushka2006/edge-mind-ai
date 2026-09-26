import {
  DeviceInfo,
  MemoryItem,
  ConflictItem,
  RoutingPolicy,
  SyncActivityEvent,
  AuditLog,
  MemoryVersion,
} from '@/types';
import { generateEmbedding } from '@/lib/vector';

export const INITIAL_ORGANIZATION = {
  id: 'ORG-804',
  name: 'AeroTech Industrial Dynamics',
  tier: 'Enterprise Edge AI Suite',
  devicesCount: 5,
  policiesCount: 6,
};

export const INITIAL_DEVICES: DeviceInfo[] = [
  {
    id: 'DEV-001',
    name: 'Machine Edge #01 (CNC Milling Spindle)',
    type: 'EDGE_MACHINE',
    organization: 'AeroTech Industrial Dynamics',
    owner: 'Chief Engineer Marcus Vance',
    registrationDate: '2026-01-15T08:00:00Z',
    lastSeen: '2026-09-26T00:45:12Z',
    status: 'ONLINE',
    ipAddress: '192.168.10.42',
    firmwareVersion: 'v4.18.2-edge',
    storageUsedGb: 4.8,
    storageTotalGb: 16.0,
    memoryCount: 142,
    vectorCount: 142,
    pendingSyncCount: 14,
    conflictCount: 3,
    cpuUsage: 28,
    ramUsage: 44,
    temperatureC: 62.4,
    networkLatencyMs: 42,
  },
  {
    id: 'DEV-002',
    name: 'Robotic Arm Delta #04 (Precision Welder)',
    type: 'INDUSTRIAL_ROBOT',
    organization: 'AeroTech Industrial Dynamics',
    owner: 'Robotics Lead Sarah Chen',
    registrationDate: '2026-02-03T11:20:00Z',
    lastSeen: '2026-09-26T00:46:00Z',
    status: 'ONLINE',
    ipAddress: '192.168.10.77',
    firmwareVersion: 'v5.2.0-rtos',
    storageUsedGb: 6.2,
    storageTotalGb: 32.0,
    memoryCount: 118,
    vectorCount: 118,
    pendingSyncCount: 6,
    conflictCount: 2,
    cpuUsage: 35,
    ramUsage: 52,
    temperatureC: 58.1,
    networkLatencyMs: 38,
  },
  {
    id: 'DEV-003',
    name: 'Smart Kiosk #02 (Field Diagnostic Terminal)',
    type: 'SMART_KIOSK',
    organization: 'AeroTech Industrial Dynamics',
    owner: 'Maintenance Super Dave Miller',
    registrationDate: '2026-03-12T09:15:00Z',
    lastSeen: '2026-09-26T00:30:10Z',
    status: 'OFFLINE',
    ipAddress: '10.240.1.18',
    firmwareVersion: 'v3.9.1-edge',
    storageUsedGb: 8.4,
    storageTotalGb: 16.0,
    memoryCount: 89,
    vectorCount: 89,
    pendingSyncCount: 28,
    conflictCount: 4,
    cpuUsage: 14,
    ramUsage: 38,
    temperatureC: 45.0,
    networkLatencyMs: 0,
  },
  {
    id: 'DEV-004',
    name: 'Autonomous Drone #09 (Pipeline LiDAR & Thermal)',
    type: 'DRONE',
    organization: 'AeroTech Industrial Dynamics',
    owner: 'Field Ops Lead Elena Rostova',
    registrationDate: '2026-04-05T14:40:00Z',
    lastSeen: '2026-09-26T00:47:33Z',
    status: 'ONLINE',
    ipAddress: '10.240.8.99',
    firmwareVersion: 'v6.0.4-aero',
    storageUsedGb: 12.1,
    storageTotalGb: 64.0,
    memoryCount: 96,
    vectorCount: 96,
    pendingSyncCount: 9,
    conflictCount: 1,
    cpuUsage: 64,
    ramUsage: 71,
    temperatureC: 48.7,
    batteryPct: 82,
    networkLatencyMs: 115,
  },
  {
    id: 'DEV-005',
    name: 'Sensor Hub #07 (Geothermal Wellhead Monitor)',
    type: 'SENSOR_HUB',
    organization: 'AeroTech Industrial Dynamics',
    owner: 'Infrastructure Lead Dr. Aris Thorne',
    registrationDate: '2026-01-20T06:00:00Z',
    lastSeen: '2026-09-26T00:46:50Z',
    status: 'ONLINE',
    ipAddress: '172.16.4.12',
    firmwareVersion: 'v2.11.0-ultra',
    storageUsedGb: 2.3,
    storageTotalGb: 8.0,
    memoryCount: 75,
    vectorCount: 75,
    pendingSyncCount: 3,
    conflictCount: 0,
    cpuUsage: 12,
    ramUsage: 24,
    temperatureC: 71.3,
    networkLatencyMs: 56,
  },
];

export const INITIAL_POLICIES: RoutingPolicy[] = [
  {
    id: 'POL-001',
    name: 'Sensitive Diagnostic & Auth Isolation',
    description: 'Biometrics, operator credentials, and proprietary machining telemetry remain strictly on-device.',
    condition: "sensitivity == 'SENSITIVE' || sensitivity == 'LOCAL_ONLY'",
    target: 'LOCAL_ONLY',
    priority: 'BACKGROUND',
    enabled: true,
  },
  {
    id: 'POL-002',
    name: 'Critical Mechanical Failure Alerts',
    description: 'Immediate edge-to-cloud synchronization for high-severity safety anomalies and thermal runaway.',
    condition: "importance == 'CRITICAL' && (type == 'Event' || type == 'System event')",
    target: 'HIGH_PRIORITY_SYNC',
    priority: 'CRITICAL',
    enabled: true,
  },
  {
    id: 'POL-003',
    name: 'High-Frequency Sensor Telemetry Pruning',
    description: 'Retain raw vibration and thermocouple telemetry on edge with 14-day sliding expiration.',
    condition: "type == 'Sensor observation'",
    target: 'LOCAL_WITH_EXPIRATION',
    priority: 'LOW',
    enabled: true,
  },
  {
    id: 'POL-004',
    name: 'Fleet Operational Knowledge & Maintenance Logs',
    description: 'Technician notes, repair summaries, and calibration manuals replicate to centralized cloud Qdrant.',
    condition: "type == 'Knowledge' || type == 'Document' || type == 'Instruction'",
    target: 'SYNC_CLOUD',
    priority: 'NORMAL',
    enabled: true,
  },
];

// Generate 520 realistic memories across the 5 devices
export function generateSeedMemories(): MemoryItem[] {
  const memories: MemoryItem[] = [];

  // Key industrial scenarios for Machine Edge #01
  const primaryScenarios = [
    {
      id: 'M-1024',
      deviceId: 'DEV-001',
      title: 'Spindle Bearing Thermal Observation Overheat',
      content:
        'Machine Edge #01 primary spindle bearing ceramic cage registered elevated operating temperature at 82.4°C during high-torque milling cycle #4402. Threshold is 75°C. Cooling lubricant flow nominal at 3.2 L/min.',
      type: 'Sensor observation' as const,
      importance: 'CRITICAL' as const,
      sensitivity: 'INTERNAL' as const,
      source: 'sensor_telemetry' as const,
      version: 3,
      syncStatus: 'CONFLICT' as const,
      cloudStatus: 'OUT_OF_SYNC' as const,
      expiration: null,
      tags: ['spindle', 'temperature', 'overheating', 'milling', 'bearing'],
      metadata: {
        machineId: 'CNC-EDGE-01',
        component: 'Spindle Bearing B-2',
        metric: 'temperature',
        unit: 'celsius',
        value: 82.4,
        threshold: 75.0,
        anomalyDetected: true,
        location: 'Bay 14',
      },
      isLocalOnly: false,
    },
    {
      id: 'M-1025',
      deviceId: 'DEV-001',
      title: 'Technician Inspection: Spindle Lubrication Line Check',
      content:
        'Technician inspected CNC Spindle 01 after thermal alert. Detected minor particulate debris in tertiary micro-nozzle filter. Cleaned nozzle and replenished Mobil SHC 626 synthetic oil. Spindle restarted for calibration run.',
      type: 'Observation' as const,
      importance: 'HIGH' as const,
      sensitivity: 'INTERNAL' as const,
      source: 'technician' as const,
      version: 2,
      syncStatus: 'SYNCED' as const,
      cloudStatus: 'SYNCED' as const,
      expiration: null,
      tags: ['technician', 'lubrication', 'maintenance', 'inspection', 'spindle'],
      metadata: {
        technician: 'Dan Kovacs (ID: T-882)',
        workOrder: 'WO-9941',
        action: 'clean_and_replenish',
      },
      isLocalOnly: false,
    },
    {
      id: 'M-1026',
      deviceId: 'DEV-001',
      title: 'Emergency Thermal Cutoff Protective Event',
      content:
        'Hardware safety interlock triggered automatic emergency feed hold at 14:32:08 UTC when spindle thermal delta exceeded 4.5°C/min. Tool retracted along Z-axis safely without workpiece gouging.',
      type: 'Event' as const,
      importance: 'CRITICAL' as const,
      sensitivity: 'INTERNAL' as const,
      source: 'edge_device' as const,
      version: 1,
      syncStatus: 'SYNCED' as const,
      cloudStatus: 'SYNCED' as const,
      expiration: null,
      tags: ['emergency', 'thermal', 'cutoff', 'safety', 'feed_hold'],
      metadata: {
        eventCode: 'INTERLOCK_Z_SAFE',
        durationSec: 4.2,
      },
      isLocalOnly: false,
    },
    {
      id: 'M-1027',
      deviceId: 'DEV-001',
      title: 'High-Frequency Vibration Harmonics Spectral Analysis',
      content:
        'Piezoelectric triaxial accelerometer registered 3.8 mm/s RMS vibration at 420 Hz harmonic frequency. Correlates with outer race flaw signature on front angular contact bearing assembly.',
      type: 'Sensor observation' as const,
      importance: 'HIGH' as const,
      sensitivity: 'INTERNAL' as const,
      source: 'sensor_telemetry' as const,
      version: 1,
      syncStatus: 'QUEUED' as const,
      cloudStatus: 'NOT_SYNCED' as const,
      expiration: '2026-10-26T00:00:00Z',
      tags: ['vibration', 'harmonics', 'accelerometer', 'bearing', 'frequency'],
      metadata: {
        sensor: 'PCB Piezotronics 356A32',
        rmsMmS: 3.8,
        peakHz: 420,
      },
      isLocalOnly: false,
    },
    {
      id: 'M-1028',
      deviceId: 'DEV-001',
      title: 'Operator Biometric & Local Key Vault Secret',
      content:
        'Hardware TPM session token and operator encrypted local credential signature for local override console. Restricted to on-device Secure Enclave.',
      type: 'Preference' as const,
      importance: 'CRITICAL' as const,
      sensitivity: 'LOCAL_ONLY' as const,
      source: 'edge_device' as const,
      version: 1,
      syncStatus: 'DEFERRED' as const,
      cloudStatus: 'NOT_SYNCED' as const,
      expiration: null,
      tags: ['security', 'local_only', 'credentials', 'tpm'],
      metadata: {
        enclaveId: 'TPM-SEC-09',
        isolationEnforced: true,
      },
      isLocalOnly: true,
    },
  ];

  // Push primary scenarios
  for (const s of primaryScenarios) {
    memories.push({
      ...s,
      userId: 'USR-ADMIN',
      orgId: 'ORG-804',
      embedding: generateEmbedding(`${s.title} ${s.content} ${s.tags.join(' ')}`),
      createdAt: '2026-09-25T14:32:00Z',
      updatedAt: '2026-09-25T18:40:00Z',
      lastAccessedAt: '2026-09-26T00:35:10Z',
      confidence: 0.98,
      qualityScore: {
        sourceAvailability: 1.0,
        confidence: 0.98,
        recency: 0.95,
        verification: 0.92,
        completeness: 0.96,
      },
    });
  }

  // Device-specific topic matrices to synthesize 500+ diverse, realistic edge items
  const devices = [
    {
      id: 'DEV-001',
      topics: [
        'CNC Tool Holder Clamp Force Calibration',
        'Coolant Emulsion pH and Brix Refractometer Reading',
        'Linear Guide Rail Y-Axis Backlash Compensation',
        'Spindle Chiller Glycol Circulation Pressure',
        'Chip Conveyor Motor Current Draw Load Spike',
        'Servo Drive Regenerative Braking Resistor Temperature',
        'Optical Linear Glass Scale Position Discrepancy',
        'Automatic Tool Changer Carousel Position Inductive Sensor',
        'Spindle Taper Air Purge Pneumatic Differential',
        'Machining Feedrate Adaptive Override Event',
      ],
      types: ['Sensor observation', 'Observation', 'Event', 'System event', 'Instruction'] as const,
    },
    {
      id: 'DEV-002',
      topics: [
        'Robotic Joint 3 Harmonic Drive Torque Ripple',
        'Shielding Gas Argon Flow Meter Flowrate Variance',
        'Welding Torch Tip Wire Feed Jam Anomaly',
        'Safety Light Curtain Intrusion Laser Break Log',
        'End-Effector TCP Tool Center Point Laser Alignment',
        'EtherCAT Bus Cycle Jitter and Packet Drop Analysis',
        'Welding Arc Voltage Droop Under High Current Pulse',
        'Robotic Arm Payload Weight Verification Load Cell',
        'Thermal Expansion Arm Segment Length Variance',
        'Automated Seam Tracking Optical Laser Scanner Observation',
      ],
      types: ['Event', 'Sensor observation', 'Task', 'Device state', 'Knowledge'] as const,
    },
    {
      id: 'DEV-003',
      topics: [
        'Field Diagnostic Touchscreen Digitizer Recalibration',
        'Offline Cache Synchronization Queue Watermark',
        'Cellular 4G LTE Signal Degradation & Packet Re-queue',
        'Technician Field Maintenance Checklist Protocol v4',
        'Emergency Diagnostic Dump File Archived Locally',
        'Uninterruptible Power Supply Battery Internal Impedance',
        'Industrial RFID Tag Reader Firmware Handshake',
        'Rugged Enclosure Internal Dehumidifier Cycle Trigger',
        'Local SQLite Vector Partition Integrity Verification',
        'Field Service Dispatch Work Order Synchronization',
      ],
      types: ['Instruction', 'Fact', 'Document', 'Preference', 'Conversation'] as const,
    },
    {
      id: 'DEV-004',
      topics: [
        'Pipeline Thermal Gradient Infrared Hotspot Identification',
        'LiDAR Point Cloud Terrain Obstacle Tree Canopy Alert',
        'Brushless Motor 2 ESC PWM Duty Cycle Anomaly',
        'Autonomous Return-To-Home Battery Reserve Margin Recalculation',
        'Barometric Altimeter vs GPS Altitude Discrepancy Log',
        'Propeller Aerodynamic Flutter Acoustic Signature',
        'Telemetry Satellite Uplink Burst Transmission State',
        'Geofence Boundary Proximity Avoidance Maneuver',
        'Gimbal Stabilizer Inertial Measurement Unit Calibration',
        'Pipeline Cathodic Protection Voltage Remote Inspection',
      ],
      types: ['Image description', 'Observation', 'Sensor observation', 'Task', 'Event'] as const,
    },
    {
      id: 'DEV-005',
      topics: [
        'Geothermal Wellhead High Pressure Transducer Pulse',
        'Hydrogen Sulfide Ambient Gas Spectrometer Reading',
        'Subsurface Downhole Thermocouple Depth Gradient',
        'Steam Turbine Inlet Control Valve Actuation Timing',
        'Corrosion Inhibitor Chemical Injection Flow Rate',
        'Seismic Micro-Tremor Triaxial Geophone Signal',
        'Solar Panel Dust Deposition Photovoltaic Efficiency Droop',
        'Remote RTU Modbus Remote Terminal Unit CRC Error Rate',
        'Wellhead Annular Pressure Relief Blowdown Event',
        'Low-Power Sleep Mode Wakeup Clock Synchronization',
      ],
      types: ['Sensor observation', 'Fact', 'Event', 'Device state', 'Knowledge'] as const,
    },
  ];

  const importanceLevels: ('CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW')[] = [
    'NORMAL',
    'HIGH',
    'NORMAL',
    'LOW',
    'CRITICAL',
  ];
  const sensitivityLevels: ('PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'SENSITIVE' | 'LOCAL_ONLY')[] = [
    'INTERNAL',
    'INTERNAL',
    'CONFIDENTIAL',
    'PUBLIC',
    'LOCAL_ONLY',
  ];
  const syncStatuses: ('SYNCED' | 'PENDING' | 'QUEUED' | 'SYNCED' | 'FAILED')[] = [
    'SYNCED',
    'SYNCED',
    'PENDING',
    'QUEUED',
    'SYNCED',
  ];

  let currentId = 1030;

  for (let i = 0; i < 515; i++) {
    const dev = devices[i % devices.length];
    const topic = dev.topics[i % dev.topics.length];
    const memType = dev.types[i % dev.types.length];
    const importance = importanceLevels[i % importanceLevels.length];
    const sensitivity = sensitivityLevels[i % sensitivityLevels.length];
    const syncStatus = sensitivity === 'LOCAL_ONLY' ? 'DEFERRED' : syncStatuses[i % syncStatuses.length];
    const isLocalOnly = sensitivity === 'LOCAL_ONLY';

    const dayOffset = Math.floor(i / 20);
    const hour = (i * 7) % 24;
    const min = (i * 13) % 60;
    const dateStr = `2026-09-${String(Math.max(1, 25 - dayOffset)).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}:00Z`;

    const title = `${topic} - Sequence #${i + 1}`;
    const content = `Edge record ${currentId} logged from ${dev.id}. Telemetry parameters for ${topic.toLowerCase()} indicated stable feedback metrics within sigma tolerance. Automated anomaly scanner evaluated confidence at ${(0.88 + (i % 12) * 0.01).toFixed(2)}. Relevant subsystem: ${topic.split(' ')[0]}.`;

    const tags = [
      topic.split(' ')[0].toLowerCase(),
      topic.split(' ')[1]?.toLowerCase() || 'edge',
      dev.id.toLowerCase(),
      memType.toLowerCase().replace(/\s+/g, '_'),
    ];

    memories.push({
      id: `M-${currentId}`,
      deviceId: dev.id,
      userId: 'USR-OPERATOR',
      orgId: 'ORG-804',
      title,
      content,
      type: memType,
      embedding: generateEmbedding(`${title} ${content} ${tags.join(' ')}`),
      createdAt: dateStr,
      updatedAt: dateStr,
      lastAccessedAt: dateStr,
      importance,
      confidence: Number((0.85 + (i % 15) * 0.01).toFixed(2)),
      sensitivity,
      source: i % 3 === 0 ? 'sensor_telemetry' : i % 3 === 1 ? 'edge_device' : 'technician',
      version: 1 + (i % 3),
      syncStatus,
      cloudStatus: syncStatus === 'SYNCED' ? 'SYNCED' : 'NOT_SYNCED',
      expiration: i % 4 === 0 ? '2026-11-15T00:00:00Z' : null,
      tags,
      metadata: {
        sequence: i + 1,
        telemetrySampleHz: 100,
        subsystem: topic.split(' ')[0],
      },
      isLocalOnly,
      qualityScore: {
        sourceAvailability: 1.0,
        confidence: Number((0.85 + (i % 15) * 0.01).toFixed(2)),
        recency: Number((0.7 + (i % 30) * 0.01).toFixed(2)),
        verification: 0.9,
        completeness: 0.95,
      },
    });

    currentId++;
  }

  return memories;
}

// 22 Pre-configured Realistic Edge-to-Cloud Conflicts for the Conflict Center
export const INITIAL_CONFLICTS: ConflictItem[] = [
  {
    id: 'CONF-101',
    memoryId: 'M-1024',
    deviceId: 'DEV-001',
    localVersion: 3,
    cloudVersion: 2,
    changedFields: ['content', 'value', 'threshold', 'updatedAt'],
    conflictType: 'CONTENT_DRIFT',
    status: 'UNRESOLVED',
    localContent:
      'Machine Edge #01 primary spindle bearing ceramic cage registered elevated operating temperature at 82.4°C during high-torque milling cycle #4402. Threshold is 75°C. Cooling lubricant flow nominal at 3.2 L/min.',
    cloudContent:
      'Machine Edge #01 primary spindle bearing operating temperature reported at 79.1°C during milling cycle #4402 according to central telemetry smoother. Work order flagged as advisory.',
    localMetadata: {
      temperature: 82.4,
      threshold: 75.0,
      sensor: 'Spindle-Thermocouple-A',
      anomalyFlag: true,
    },
    cloudMetadata: {
      temperature: 79.1,
      threshold: 80.0,
      sensor: 'Cloud-Smoothed-Estimator',
      anomalyFlag: false,
    },
    detectedAt: '2026-09-25T18:42:10Z',
  },
  {
    id: 'CONF-102',
    memoryId: 'M-1035',
    deviceId: 'DEV-001',
    localVersion: 4,
    cloudVersion: 3,
    changedFields: ['content', 'expiration', 'technicianNotes'],
    conflictType: 'VERSION_MISMATCH',
    status: 'UNRESOLVED',
    localContent:
      'CNC Spindle 01 scheduled preventive maintenance overhaul rescheduled to immediate Saturday shutdown by On-Site Shop Supervisor after detecting bearing acoustic resonance spike.',
    cloudContent:
      'CNC Spindle 01 preventive maintenance scheduled for month-end batch window (October 30) by centralized SAP Plant Maintenance workflow.',
    localMetadata: { scheduledDate: '2026-09-27', priority: 'URGENT_OVERHAUL' },
    cloudMetadata: { scheduledDate: '2026-10-30', priority: 'ROUTINE_CYCLE' },
    detectedAt: '2026-09-25T19:15:30Z',
  },
  {
    id: 'CONF-103',
    memoryId: 'M-1048',
    deviceId: 'DEV-002',
    localVersion: 2,
    cloudVersion: 2,
    changedFields: ['content', 'jointCalibrationOffset'],
    conflictType: 'TIMESTAMP_DISCREPANCY',
    status: 'UNRESOLVED',
    localContent:
      'Robotic Arm Delta #04 Joint 3 zero-datum offset adjusted locally by +0.14 degrees after laser alignment test in Bay 03 to eliminate 0.3mm seam gap.',
    cloudContent:
      'Robotic Arm Delta #04 Joint 3 zero-datum offset adjusted by cloud CAD-to-Robot pipeline by -0.05 degrees based on fleet-wide kinematic average.',
    localMetadata: { offsetDegrees: 0.14, source: 'Local Laser Interferometer' },
    cloudMetadata: { offsetDegrees: -0.05, source: 'Fleet CAD Sync Engine' },
    detectedAt: '2026-09-25T20:02:45Z',
  },
  {
    id: 'CONF-104',
    memoryId: 'M-1062',
    deviceId: 'DEV-003',
    localVersion: 3,
    cloudVersion: 1,
    changedFields: ['content', 'firmwareTarget', 'rollbackState'],
    conflictType: 'DELETED_MODIFIED',
    status: 'UNRESOLVED',
    localContent:
      'Smart Kiosk #02 field technician purged legacy diagnostic partition to free 2.4 GB for local Qdrant Edge vector indexing storage buffer.',
    cloudContent:
      'Smart Kiosk #02 diagnostic partition marked as critical historical retention volume by Cloud Compliance Auditor.',
    localMetadata: { freedGb: 2.4, action: 'PURGE_FOR_VECTOR_STORAGE' },
    cloudMetadata: { action: 'LOCK_AUDIT_PARTITION' },
    detectedAt: '2026-09-25T21:20:12Z',
  },
  {
    id: 'CONF-105',
    memoryId: 'M-1088',
    deviceId: 'DEV-004',
    localVersion: 2,
    cloudVersion: 2,
    changedFields: ['content', 'waypointCoordinates', 'altitudeMeters'],
    conflictType: 'CONTENT_DRIFT',
    status: 'UNRESOLVED',
    localContent:
      'Drone #09 LiDAR altitude ceiling lowered to 45 meters above ground due to local valley microburst gusts and heavy fog canopy detected by onboard radar.',
    cloudContent:
      'Drone #09 flight mission plan maintained at nominal 90 meters standard surveying altitude per FAA Part 107 flight corridor authorization.',
    localMetadata: { altitudeM: 45, reason: 'LOCAL_MICROBURST_WEATHER' },
    cloudMetadata: { altitudeM: 90, reason: 'STANDARD_FLIGHT_PLAN' },
    detectedAt: '2026-09-25T22:11:05Z',
  },
  {
    id: 'CONF-106',
    memoryId: 'M-1102',
    deviceId: 'DEV-005',
    localVersion: 3,
    cloudVersion: 3,
    changedFields: ['content', 'psiPressureLimit'],
    conflictType: 'VERSION_MISMATCH',
    status: 'UNRESOLVED',
    localContent:
      'Geothermal Wellhead #07 choke valve high-pressure safety threshold throttled back to 2,850 PSI following transducer oscillation at hot-spring fissure.',
    cloudContent:
      'Geothermal Wellhead #07 high-pressure setpoint elevated to 3,200 PSI to maintain grid peak electrical demand target.',
    localMetadata: { setpointPsi: 2850, riskMitigation: 'HIGH_PRESSURE_BURST' },
    cloudMetadata: { setpointPsi: 3200, productionTarget: 'PEAK_MEGAWATTS' },
    detectedAt: '2026-09-25T23:04:19Z',
  },
];

export const INITIAL_SYNC_ACTIVITIES: SyncActivityEvent[] = [
  {
    id: 'ACT-901',
    timestamp: '2026-09-26T00:46:20Z',
    memoryId: 'M-1025',
    deviceId: 'DEV-001',
    operation: 'UPLOAD',
    status: 'SUCCESS',
    details: 'Uploaded technician inspection record to Cloud Qdrant Server collection "edge_memories".',
  },
  {
    id: 'ACT-902',
    timestamp: '2026-09-26T00:45:50Z',
    memoryId: 'M-1024',
    deviceId: 'DEV-001',
    operation: 'CONFLICT_DETECTED',
    status: 'WARNING',
    details: 'Version collision: Local v3 differs from Cloud v2 on spindle bearing temperature metric.',
  },
  {
    id: 'ACT-903',
    timestamp: '2026-09-26T00:44:11Z',
    memoryId: 'M-1026',
    deviceId: 'DEV-001',
    operation: 'UPLOAD',
    status: 'SUCCESS',
    details: 'Emergency safety cutoff interlock event synchronized with Critical priority queue.',
  },
  {
    id: 'ACT-904',
    timestamp: '2026-09-26T00:42:00Z',
    memoryId: 'M-1048',
    deviceId: 'DEV-002',
    operation: 'DELTA_SYNC',
    status: 'SUCCESS',
    details: 'Delta sync pushed 4 updated kinematic records to cloud centralized store.',
  },
  {
    id: 'ACT-905',
    timestamp: '2026-09-26T00:38:15Z',
    memoryId: 'M-1088',
    deviceId: 'DEV-004',
    operation: 'CONFLICT_DETECTED',
    status: 'WARNING',
    details: 'Drone terrain waypoint variance detected during flight corridor merge.',
  },
  {
    id: 'ACT-906',
    timestamp: '2026-09-26T00:30:10Z',
    memoryId: 'M-1062',
    deviceId: 'DEV-003',
    operation: 'UPLOAD',
    status: 'FAILED',
    details: 'Connection dropped on Smart Kiosk #02 cellular gateway. Sync queued for offline retry.',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'AUD-801',
    timestamp: '2026-09-26T00:46:12Z',
    userId: 'USR-OPERATOR',
    deviceId: 'DEV-001',
    action: 'MEMORY_UPDATE',
    resource: 'M-1024',
    previousState: 'v2 (temp=79.1°C)',
    newState: 'v3 (temp=82.4°C)',
    details: 'Updated spindle temperature sensor observation after physical gauge verification.',
  },
  {
    id: 'AUD-802',
    timestamp: '2026-09-26T00:40:00Z',
    userId: 'USR-ADMIN',
    deviceId: 'DEV-001',
    action: 'SEARCH_LOCAL',
    resource: 'QdrantEdge/edge_memories',
    details: 'Executed local semantic query: "machine overheating and spindle bearing temperature".',
  },
  {
    id: 'AUD-803',
    timestamp: '2026-09-26T00:35:10Z',
    userId: 'USR-SYSTEM',
    deviceId: 'DEV-001',
    action: 'SYNC_INITIATE',
    resource: 'SyncEngine',
    details: 'Background sync worker processed 18 queued items across 3 priority channels.',
  },
  {
    id: 'AUD-804',
    timestamp: '2026-09-26T00:25:00Z',
    userId: 'USR-ADMIN',
    deviceId: 'DEV-003',
    action: 'OFFLINE_ENGAGE',
    resource: 'ConnectivityManager',
    details: 'Engaged Offline Simulation Mode for field resilience demonstration.',
  },
];
