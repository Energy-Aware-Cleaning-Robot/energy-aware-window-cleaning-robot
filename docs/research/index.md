# 1. Introduction and Research Objectives

## 1.1 Background and motivation

Coverage Path Planning (CPP) generates a route that enables a robot to cover a required workspace. Existing CPP methods commonly prioritise complete coverage and travel distance. For a vertical-climbing window-cleaning robot, however, **path orientation, turning, cleaning time, adhesion requirements and trajectory tracking** also affect total energy consumption.

Ground-based cleaning CPP is well established. Energy-aware CPP for wall-climbing cleaning robots remains comparatively less explored, particularly where the planner must account for the directional effects of gravity and the continuous electrical power required for suction adhesion. A low-cost robot also benefits from a computationally simple planning method.

The motivation is therefore to investigate coverage strategies that reduce energy consumption **without compromising required cleaning coverage or reliable trajectory tracking**.

## 1.2 Problem statement

Conventional CPP often minimises distance or completion time while ensuring coverage. A suction-based vertical-climbing robot has additional energy demands associated with gravity, travel direction, adhesion, turning and cleaning. Consequently:

> The shortest coverage path is not necessarily the lowest-energy coverage path.

The research problem is to identify a coverage strategy that maintains complete cleaning of a vertical glass façade while reducing predicted total energy consumption.

## 1.3 Research aim

To **develop and evaluate an energy-aware complete coverage path planning method** for a low-cost suction-based window-cleaning robot operating on a vertical glass façade.

## 1.4 Research objectives

1. **Robot development:** Develop a low-cost suction-based wall-climbing cleaning robot.
2. **Energy characterisation:** Characterise direction-dependent locomotion and adhesion energy consumption.
3. **Energy modelling:** Develop a model incorporating locomotion, adhesion, turning and cleaning energy.
4. **Coverage simulation:** Develop and simulate different complete coverage strategies.
5. **Comparative evaluation:** Compare conventional and energy-aware CPP based on energy consumption, coverage, path length, number of turns and completion time.

## 1.5 Research questions

### RQ1 — Coverage pattern

How do different coverage patterns, including horizontal, vertical and spiral trajectories, affect energy consumption on a vertical surface?

### RQ2 — Energy-driving path characteristics

Which path characteristics—travel distance, number of turns, vertical displacement and cleaning time—have the greatest influence on energy consumption?

### RQ3 — Energy-aware planning performance

Can an energy-aware coverage planner outperform conventional strategies while maintaining comparable coverage and tracking accuracy?

## 1.6 Scope and assumptions

The initial investigation focuses on a **flat, rectangular, obstacle-free vertical glass façade**. The robot starts at a known location and uses suction adhesion, with a low-cost motor, sensor and controller architecture.

| Parameter | Initial research assumption |
| --- | --- |
| Surface | Flat vertical glass |
| Cleaning region | Rectangular |
| Obstacles | None in the first iteration |
| Starting location | Known |
| Adhesion | Suction-based |
| Hardware | Low-cost motors, sensors and controller |
| Coverage goal | Complete accessible-surface coverage |

### Physical and simulated environments

The report introduces a **50 cm × 50 cm glass panel** for physical testing and a larger façade for simulation. A later methodology draft specifies a **4 m × 6 m façade**, a **0.3 m cleaning width** in Python simulation and a bottom-left starting position. These represent different stages of the project plan; the final physical test dimensions are not yet consistently specified.

## 1.7 Research roadmap

The proposed progression is to review the literature, define the façade scenario, develop the prototype, measure energy use, construct the energy model, compare simulated paths, develop the energy-aware planner, validate experimentally and analyse results.

**Continue reading:** [Literature Review](/research/literature-review) → [Research Gap](/research/research-gap) → [Methodology](/research/methodology).

*Source: FYP report, Section 1 (pp. 2–3), Section 3 (pp. 17–19) and methodology sequence (p. 31).*
