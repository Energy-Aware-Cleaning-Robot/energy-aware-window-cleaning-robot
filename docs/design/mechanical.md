
---
title: Mechanical Design
description: Mechanical architecture, locomotion, chassis optimisation and interactive 3D CAD model.
layout: doc
aside: false
outline: deep
---

# Mechanical & Locomotion Design

The mechanical subsystem focuses on developing a lightweight, low-cost suction-based window-cleaning robot capable of operating on vertical glass surfaces.

The design integrates the chassis, locomotion system and suction chamber while prioritising structural rigidity, reliable adhesion and energy efficiency.

---

## 1. Mechanical Design Overview

The mechanical architecture is designed to:

1. Maintain structural stability during vertical operation.
2. Support the suction adhesion mechanism.
3. Provide sufficient wheel traction for climbing.
4. Accommodate motors, electronics and sensors.
5. Minimise the overall robot mass and energy consumption.

### 1.1 Preliminary Design Specifications

| Parameter | Specification |
|---|---|
| Robot Dimensions | 200 × 200 × 80 mm |
| Target Total Mass | 1.5 kg |
| Chassis Material | PLA |
| Manufacturing Method | FDM 3D Printing |
| Operating Surface | Flat Vertical Glass |
| Adhesion Method | Negative-Pressure Suction |
| Suction Configuration | Single Suction Chamber |
| Locomotion | Motor-Driven Wheels |
| Cleaning Mechanism | Under Development |

::: info Design Status
These specifications are preliminary and will be updated following chassis optimisation, component selection and experimental validation.
:::

---

## 2. Interactive 3D CAD Model

The interactive CAD explorer below presents the preliminary chassis design of the window-cleaning robot.

Visitors can rotate and zoom into the model, select hotspots positioned on the chassis, and explore the engineering descriptions of individual components.

<RobotCADViewer />

*Figure 1: Interactive 3D CAD model and subsystem explorer of the window-cleaning robot.*

::: tip How to Use the Interactive Viewer
- **Left-click and drag:** Rotate the robot.
- **Right-click and drag:** Pan around the model.
- **Scroll:** Zoom in or out.
- **Click a hotspot:** Display information about the selected component.
- **Select a component card:** Open its engineering description.
- **Select a category:** Filter the displayed subsystems.
- **Reset:** Return to the default viewing angle.
:::

::: info Current CAD Model
The current GLB model represents the preliminary chassis geometry. The hotspot coordinates are provisional and must be calibrated to the actual model.

Additional components such as motors, wheels, suction fan and electronics will be incorporated as the mechanical assembly develops.
:::

---

## 3. Chassis Design

### 3.1 Design Requirements

The chassis provides the structural framework for mounting the robot's locomotion, suction and electronic components.

The primary requirements include:

- Low overall mass.
- Sufficient structural rigidity.
- Compact geometry.
- Ease of manufacturing and assembly.
- Integration of the suction chamber.
- Accessibility for maintenance and component replacement.

### 3.2 Material Selection

Polylactic Acid (PLA) is selected for the preliminary chassis because of its suitability for low-cost FDM 3D printing and rapid prototyping.

The material enables multiple chassis iterations to be manufactured and evaluated.

However, the final design must account for mechanical loading, temperature sensitivity and long-term durability.

### 3.3 Preliminary Chassis Design

The initial chassis was developed using SolidWorks.

The design adopts a compact square configuration with a central region intended for suction chamber integration.

![Preliminary chassis design](/images/chassis-iteration-1.png)

*Figure 2: Preliminary SolidWorks chassis design.*

### 3.4 Chassis Weight Optimisation

The preliminary chassis mass was approximately:

$$
m_{\text{chassis,initial}} = 532 \text{ g}
$$

Reducing the chassis mass is important because a lighter robot requires less force to overcome gravity during upward climbing.

The proposed optimisation strategies include:

1. Reducing unnecessary wall thickness.
2. Removing non-load-bearing material.
3. Integrating the suction chamber into the chassis.
4. Optimising motor and electronics mounting locations.
5. Maintaining adequate rigidity around critical mounting points.

The optimised chassis mass will be determined using SolidWorks mass properties and verified after fabrication.

---

## 4. Locomotion System

### 4.1 Locomotion Overview

The locomotion system uses motor-driven wheels to move the robot along the glass surface while suction adhesion is maintained.

The intended movement directions include:

- Upward movement.
- Downward movement.
- Horizontal movement.
- Turning and reorientation.

These movements will be characterised experimentally to determine their respective energy requirements.

### 4.2 Gravitational Force

For a robot operating on a vertical surface, the gravitational force acts downward.

$$
F_g = mg
$$

Where:

- $F_g$ = gravitational force (N)
- $m$ = robot mass (kg)
- $g$ = gravitational acceleration (m/s²)

Assuming a preliminary robot mass of 1.5 kg:

$$
F_g = 1.5(9.81)
$$

$$
\boxed{F_g = 14.715 \text{ N}}
$$

### 4.3 Required Drive Force

During upward climbing, the drive system must overcome gravitational loading, rolling resistance and acceleration.

$$
F_{\text{drive}} = mg + F_{rr} + ma
$$

Where:

- $F_{\text{drive}}$ = total required drive force (N)
- $F_{rr}$ = rolling resistance (N)
- $a$ = upward acceleration (m/s²)

For constant-speed upward movement:

$$
a = 0
$$

Therefore:

$$
\boxed{F_{\text{drive}} = mg + F_{rr}}
$$

### 4.4 Rolling Resistance

A simplified rolling resistance model is:

$$
F_{rr} = C_{rr}N
$$

Where:

- $C_{rr}$ = rolling resistance coefficient
- $N$ = total wheel normal force (N)

The normal force depends on suction pressure and how the chassis transfers the suction load to the wheel contact points.

The rolling resistance coefficient will be estimated or measured after wheel selection.

### 4.5 Motor Torque Requirements

The torque required per driven wheel is estimated using:

$$
\tau = \frac{F_{\text{drive}}r}{n\eta}
$$

Where:

| Variable | Description | Unit |
|---|---|---|
| $\tau$ | Torque per driven wheel | Nm |
| $F_{\text{drive}}$ | Total required drive force | N |
| $r$ | Wheel radius | m |
| $n$ | Number of driven wheels | - |
| $\eta$ | Drivetrain efficiency | - |

This simplified calculation assumes approximately equal force distribution among the driven wheels.

The final motor selection will consider climbing torque, rotational speed, drivetrain efficiency, wheel traction and power consumption.

---

## 5. Suction Adhesion System

### 5.1 Adhesion Principle

The robot uses negative-pressure suction to maintain attachment to vertical glass surfaces.

A suction fan reduces the pressure inside the chamber relative to atmospheric pressure.

The theoretical suction force is:

$$
F_{\text{suction}} = \Delta P A
$$

Where:

- $F_{\text{suction}}$ = theoretical suction force (N)
- $\Delta P$ = pressure difference (Pa)
- $A$ = effective sealed suction area (m²)

### 5.2 Preliminary Suction Area

The preliminary suction area is:

$$
A = 0.06283185 \text{ m}^2
$$

The effective suction area will be verified after finalising the chamber geometry.

### 5.3 Required Adhesion Pressure

The maximum available wheel friction force is approximated by:

$$
F_{\text{friction,max}} = \mu N
$$

Where:

- $\mu$ = effective coefficient of friction
- $N$ = wheel normal force (N)

To prevent downward slipping under static conditions:

$$
\mu N \geq mg
$$

Assuming the suction force is effectively transferred to the wheel contact points:

$$
N \approx \Delta P A
$$

Therefore:

$$
\boxed{\Delta P \geq \frac{mg}{\mu A}}
$$

Including a safety factor:

$$
\boxed{
\Delta P_{\text{design}}
\geq
\frac{SF \cdot mg}{\mu A}
}
$$

Where $SF$ represents the selected safety factor.

::: warning Engineering Consideration
This is a simplified static traction model. The actual adhesion requirement also depends on wheel loading, leakage, chamber sealing, robot orientation and dynamic forces.

Experimental validation is required before unsupported vertical operation.
:::

### 5.4 Single Suction Chamber Design

The proposed chassis incorporates a single suction chamber.

The chamber design aims to:

1. Reduce unnecessary structural mass.
2. Provide sufficient negative-pressure adhesion.
3. Maintain reliable contact with the glass.
4. Minimise leakage.
5. Reduce suction system power consumption.

The final design will consider effective suction area, chamber geometry, sealing material and fan pressure-flow characteristics.

---

## 6. Mechanical Design and Energy Efficiency

### 6.1 Effect of Robot Mass

The gravitational potential energy gained during upward movement is:

$$
\Delta E_p = mg\Delta h
$$

Reducing the robot mass decreases the energy required to increase its gravitational potential energy.

### 6.2 Suction-Induced Rolling Resistance

Increasing suction pressure can improve available wheel traction.

However, additional normal loading may increase rolling resistance.

Therefore, the suction system must balance adhesion reliability, traction and electrical energy consumption.

### 6.3 Direction-Dependent Locomotion

The robot's locomotion energy is modelled as:

$$
E_{\text{loc}} = e_uD_u + e_dD_d + e_hD_h
$$

Where:

- $e_u$ = upward locomotion energy per metre (J/m)
- $e_d$ = downward locomotion energy per metre (J/m)
- $e_h$ = horizontal locomotion energy per metre (J/m)
- $D_u$ = upward distance (m)
- $D_d$ = downward distance (m)
- $D_h$ = horizontal distance (m)

The energy coefficients will be obtained experimentally and incorporated into the energy-aware CPP algorithm.

---

## 7. Mechanical Design Evaluation

The mechanical subsystem will be evaluated using the following metrics:

| Performance Metric | Evaluation Method |
|---|---|
| Chassis Mass | SolidWorks mass properties and weighing |
| Structural Rigidity | CAD analysis and physical testing |
| Motor Torque | Calculations and experimental measurements |
| Wheel Traction | Vertical climbing and slip tests |
| Suction Pressure | Differential pressure measurements |
| Rolling Resistance | Experimental characterisation |
| Energy Consumption | Voltage and current measurements |
| Climbing Stability | Controlled vertical glass experiments |

---

## 8. Future Development

- [ ] Finalise chassis dimensions and geometry.
- [ ] Reduce unnecessary chassis mass.
- [ ] Integrate the single suction chamber.
- [ ] Select suitable motors and wheels.
- [ ] Finalise the drivetrain configuration.
- [ ] Manufacture the 3D-printed chassis.
- [ ] Integrate the suction fan and sealing system.
- [ ] Conduct adhesion experiments.
- [ ] Evaluate vertical climbing performance.
- [ ] Characterise direction-dependent energy consumption.
- [ ] Calibrate interactive CAD hotspot positions.
- [ ] Add complete robot assembly to the 3D viewer.

::: warning Prototype Safety
Initial vertical-climbing experiments should be conducted on a secured glass panel close to the ground, with an independent mechanical safety tether and appropriate emergency stopping measures.
:::

---

## 9. Summary

The mechanical subsystem provides the structural foundation for the energy-aware window-cleaning robot.

The preliminary design combines a lightweight 3D-printed chassis, motor-driven locomotion and a single negative-pressure suction chamber.

Future optimisation will focus on reducing structural mass, improving adhesion reliability and minimising locomotion resistance.

Experimental measurements from the completed prototype will support the development and validation of the energy-aware Coverage Path Planning algorithm.
