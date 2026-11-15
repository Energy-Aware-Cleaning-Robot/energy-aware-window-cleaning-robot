
---
title: Mechanical Design
description: Mechanical architecture, locomotion system, chassis optimisation and interactive 3D CAD model.
outline: deep
---

# Mechanical & Locomotion Design

The mechanical subsystem focuses on developing a lightweight, low-cost suction-based window-cleaning robot capable of operating on vertical glass surfaces.

The design integrates the chassis, locomotion system and suction chamber while prioritising structural rigidity, reliable adhesion and energy efficiency.

---

## 1. Mechanical Design Overview

The mechanical architecture is designed to support the following functions:

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
The specifications represent preliminary design targets. Final dimensions, component selections and operating characteristics will be updated following prototype fabrication and experimental validation.
:::

---

## 2. Interactive 3D CAD Model

The interactive viewer below presents the preliminary mechanical design of the window-cleaning robot.

The CAD model can be rotated, zoomed and inspected from different viewing angles.

The subsystem selection menu provides descriptions of the chassis, locomotion system, suction mechanism and electronics.

<RobotCADViewer />

*Figure 1: Interactive 3D CAD model of the window-cleaning robot. Drag to rotate, scroll to zoom and select a subsystem to view its description.*

::: tip Interactive Viewer
Use the subsystem dropdown to explore the different mechanical and electrical components.

Subsystem descriptions are currently informational. Individual component highlighting and exploded views will be introduced in a future development stage.
:::

---

## 3. Chassis Design

### 3.1 Design Requirements

The chassis forms the primary structural framework of the robot.

It must support the mechanical and electrical components while maintaining sufficient rigidity during vertical climbing.

The main design considerations include:

- Low overall mass.
- Sufficient structural strength.
- Compact geometry.
- Ease of 3D printing and assembly.
- Integration of the suction chamber.
- Accessibility for maintenance and component replacement.

### 3.2 Material Selection

Polylactic Acid (PLA) is selected for the preliminary chassis prototype.

PLA is suitable for rapid prototyping due to its low cost, availability and compatibility with FDM 3D printing.

The material also allows multiple chassis iterations to be manufactured and evaluated during development.

However, the final design must consider the material's mechanical properties, temperature sensitivity and long-term durability.

### 3.3 Preliminary Chassis Design

The initial chassis was developed in SolidWorks using a compact square configuration.

The design provides mounting space for the suction system, drivetrain and electronic components.

![Preliminary chassis design](/images/chassis-iteration-1.png)

*Figure 2: Preliminary chassis design developed using SolidWorks.*

### 3.4 Chassis Weight Optimisation

The preliminary chassis mass was approximately:

$$
m_{\text{chassis,initial}} = 532 \text{ g}
$$

Reducing the chassis mass is important because a lighter robot generally requires less gravitational climbing force.

The following optimisation strategies will be investigated:

1. Reducing unnecessary wall thickness.
2. Removing non-load-bearing material.
3. Integrating the suction chamber into the chassis.
4. Optimising motor and electronics mounting locations.
5. Reducing redundant structural features.
6. Maintaining sufficient rigidity around critical mounting points.

The final chassis mass will be obtained from the updated SolidWorks model and verified experimentally after fabrication.

---

## 4. Locomotion System

### 4.1 Locomotion Overview

The locomotion system uses motor-driven wheels to move the robot across the glass surface while suction adhesion is maintained.

The drivetrain must provide sufficient traction and torque for vertical climbing.

The intended movement directions include:

- Upward movement.
- Downward movement.
- Horizontal movement.
- Turning and reorientation.

These movements are important for evaluating direction-dependent energy consumption in the Coverage Path Planning (CPP) model.

### 4.2 Gravitational Force

For a robot operating on a vertical surface, gravitational force acts downward.

The gravitational force is calculated using:

$$
F_g = mg
$$

Where:

| Variable | Description | Unit |
|---|---|---|
| $F_g$ | Gravitational force | N |
| $m$ | Total robot mass | kg |
| $g$ | Gravitational acceleration | m/s² |

Assuming a preliminary robot mass of:

$$
m = 1.5 \text{ kg}
$$

The gravitational force becomes:

$$
F_g = 1.5(9.81)
$$

$$
\boxed{F_g = 14.715 \text{ N}}
$$

This represents the downward gravitational force that the locomotion system must account for during vertical operation.

### 4.3 Required Drive Force

During upward climbing, the drive system must overcome gravitational loading and additional motion resistance.

For a simplified upward-motion model:

$$
F_{\text{drive}} = mg + F_{rr} + ma
$$

Where:

- $F_{\text{drive}}$ = required total drive force (N)
- $F_{rr}$ = rolling resistance force (N)
- $m$ = robot mass (kg)
- $a$ = upward acceleration (m/s²)

For constant-speed upward movement:

$$
a = 0
$$

Therefore:

$$
\boxed{F_{\text{drive}} = mg + F_{rr}}
$$

The rolling resistance will be determined using the selected wheel material, contact conditions and suction-induced normal loading.

### 4.4 Rolling Resistance

Rolling resistance represents the resistance experienced by the wheels as they roll along the glass surface.

A simplified rolling resistance model is:

$$
F_{rr} = C_{rr}N
$$

Where:

| Variable | Description | Unit |
|---|---|---|
| $F_{rr}$ | Rolling resistance | N |
| $C_{rr}$ | Rolling resistance coefficient | - |
| $N$ | Total wheel normal force | N |

The normal force depends on the suction system and the mechanical load distribution.

The rolling resistance coefficient will be estimated or experimentally determined after wheel selection.

### 4.5 Motor Torque Requirements

The required torque for each driven wheel can be estimated using:

$$
\tau = \frac{F_{\text{drive}}r}{n\eta}
$$

Where:

| Variable | Description | Unit |
|---|---|---|
| $\tau$ | Required torque per driven wheel | Nm |
| $F_{\text{drive}}$ | Total required drive force | N |
| $r$ | Wheel radius | m |
| $n$ | Number of driven wheels | - |
| $\eta$ | Drivetrain efficiency | - |

This simplified calculation assumes approximately equal force distribution among the driven wheels.

The final motor selection will consider:

- Required climbing torque.
- Wheel radius.
- Rotational speed.
- Motor efficiency.
- Available traction.
- Power consumption.
- Safety margin.

::: info Motor Selection
The motor torque calculation will be updated once the wheel dimensions, drivetrain configuration and rolling resistance have been finalised.
:::

---

## 5. Suction Adhesion System

### 5.1 Adhesion Principle

The robot uses negative-pressure suction to maintain attachment to vertical glass surfaces.

A suction fan reduces the pressure inside the chamber relative to the surrounding atmosphere.

The resulting pressure difference produces a force acting approximately normal to the glass surface.

The theoretical suction force is:

$$
F_{\text{suction}} = \Delta P A
$$

Where:

| Variable | Description | Unit |
|---|---|---|
| $F_{\text{suction}}$ | Theoretical suction force | N |
| $\Delta P$ | Pressure difference | Pa |
| $A$ | Effective sealed suction area | m² |

### 5.2 Preliminary Suction Area

The preliminary suction area considered in the design is:

$$
A = 0.06283185 \text{ m}^2
$$

The actual effective area must be verified from the final suction chamber geometry and sealing configuration.

### 5.3 Required Adhesion Force

The suction system must generate sufficient normal loading to provide wheel traction and prevent downward slipping.

The maximum available friction force can be approximated as:

$$
F_{\text{friction,max}} = \mu N
$$

Where:

- $\mu$ = effective coefficient of friction between the wheel and glass.
- $N$ = total wheel normal force.

For the robot to remain stationary on vertical glass:

$$
\mu N \geq mg
$$

Assuming the suction force is effectively transmitted to the wheel contact points:

$$
N \approx \Delta P A
$$

Therefore:

$$
\mu \Delta P A \geq mg
$$

Rearranging:

$$
\boxed{\Delta P \geq \frac{mg}{\mu A}}
$$

This provides an initial estimate of the minimum pressure difference required to resist downward slipping.

A safety factor should be included:

$$
\boxed{\Delta P_{\text{design}} \geq
\frac{SF \cdot mg}{\mu A}}
$$

Where $SF$ is the selected safety factor.

::: warning Engineering Consideration
This is a simplified static traction model. The actual adhesion requirement depends on wheel contact loading, chamber sealing, leakage, robot orientation, dynamic motion and possible overturning moments.

The design must be experimentally verified before unsupported vertical operation.
:::

### 5.4 Single Suction Chamber Design

The proposed mechanical architecture incorporates a single suction chamber within the chassis.

The design aims to:

1. Reduce the number of suction components.
2. Minimise additional structural mass.
3. Maintain a suitable pressure difference.
4. Provide sufficient wheel traction.
5. Reduce unnecessary energy consumption.

The chamber design will be evaluated based on:

- Effective suction area.
- Chamber geometry.
- Sealing performance.
- Pressure difference.
- Fan pressure-flow characteristics.
- Suction power consumption.

### 5.5 Suction System Energy Consumption

The suction fan consumes electrical energy throughout the period when adhesion is maintained.

The adhesion energy can be estimated using:

$$
E_{\text{adh}} = P_{\text{adh}}T
$$

Where:

- $E_{\text{adh}}$ = adhesion energy consumption (J)
- $P_{\text{adh}}$ = average suction system electrical power (W)
- $T$ = operating duration (s)

This relationship is important because the suction system may consume energy even when the robot is stationary.

Consequently, coverage paths with longer completion times may require more adhesion energy.

---

## 6. Mechanical Design and Energy Efficiency

The mechanical design directly influences the energy consumption of the robot.

### 6.1 Robot Mass

Reducing robot mass decreases gravitational loading during upward climbing.

For a fixed climbing height:

$$
\Delta E_{\text{potential}} = mg\Delta h
$$

A lower robot mass reduces the gravitational potential energy increase associated with climbing.

### 6.2 Suction-Induced Rolling Resistance

Increasing suction pressure may increase the wheel normal force.

Although this can improve available traction, it can also increase rolling resistance.

Therefore, suction pressure should be sufficient for reliable adhesion without unnecessarily increasing resistance or fan power consumption.

### 6.3 Direction-Dependent Locomotion

The robot's locomotion energy is expected to differ between upward, downward and horizontal movement.

The simplified locomotion energy model is:

$$
E_{\text{loc}} = e_uD_u + e_dD_d + e_hD_h
$$

Where:

- $e_u$ = upward locomotion energy per metre (J/m)
- $e_d$ = downward locomotion energy per metre (J/m)
- $e_h$ = horizontal locomotion energy per metre (J/m)
- $D_u$ = total upward distance (m)
- $D_d$ = total downward distance (m)
- $D_h$ = total horizontal distance (m)

The energy coefficients will be obtained experimentally after the robot prototype is operational.

These measurements will subsequently be incorporated into the energy-aware CPP algorithm.

---

## 7. Mechanical Design Evaluation

The mechanical subsystem will be evaluated using the following performance metrics.

| Performance Metric | Evaluation Method |
|---|---|
| Chassis Mass | CAD mass properties and weighing |
| Structural Rigidity | CAD analysis and physical testing |
| Motor Torque | Theoretical calculation and experimental testing |
| Wheel Traction | Vertical climbing and slip tests |
| Suction Pressure | Differential pressure measurements |
| Rolling Resistance | Experimental characterisation |
| Energy Consumption | Voltage and current measurements |
| Climbing Stability | Controlled vertical glass tests |

These measurements will support the development and validation of the robot's mathematical energy model.

---

## 8. Future Development

The next stages of mechanical development include:

- [ ] Finalise chassis dimensions and geometry.
- [ ] Reduce unnecessary chassis mass.
- [ ] Integrate the single suction chamber.
- [ ] Select suitable motors and wheels.
- [ ] Finalise the drivetrain configuration.
- [ ] Manufacture the 3D-printed chassis.
- [ ] Integrate the suction fan and sealing system.
- [ ] Conduct preliminary adhesion experiments.
- [ ] Evaluate vertical climbing performance.
- [ ] Characterise direction-dependent energy consumption.

::: warning Prototype Safety
Initial vertical climbing experiments should be conducted on a secured glass panel close to the ground, with an independent mechanical safety tether and appropriate emergency stopping measures.
:::

---

## 9. Summary

The mechanical subsystem provides the foundation for the development of the energy-aware window-cleaning robot.

The design combines a lightweight 3D-printed chassis, motor-driven locomotion and a single negative-pressure suction chamber.

Future optimisation will focus on reducing structural mass, improving adhesion reliability and minimising locomotion resistance.

Experimental measurements from the completed prototype will be used to characterise the robot's energy consumption and support the development of the energy-aware CPP algorithm.
