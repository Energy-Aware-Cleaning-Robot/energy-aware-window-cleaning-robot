# 3 Research Gap and Proposed Contribution

## 3.1 Established research

Complete Coverage Path Planning has been extensively studied for ground-based mobile robots, including approaches that aim to cover a workspace, avoid obstacles and reduce travel distance. The literature reviewed in the report also includes wall-climbing robots, glass-façade cleaning systems and energy-aware planning methods.

However, vertical robots face additional requirements: gravity affects travel direction, and the adhesion mechanism must maintain sufficient attachment force throughout operation.

## 3.2 Identified research gap

For a negative-pressure glass-cleaning robot, total operating energy depends on several interacting factors:

| Energy component | Why it matters |
| --- | --- |
| Direction-dependent locomotion | Upward, downward and horizontal movement can have different energy-per-metre costs |
| Continuous suction adhesion | Electrical power may be consumed even while stationary |
| Turning and reorientation | Frequent changes in direction add motion and time costs |
| Cleaning mechanism | Cleaning power and operating duration contribute to total energy |

The report identifies a gap in the **joint consideration of these costs in a computationally practical energy-aware CPP framework for a low-cost vertical glass-cleaning robot**. This is the research gap argued from the reviewed papers, not a claim that no related research exists anywhere.

## 3.3 Proposed contribution

The proposed contribution is to develop and evaluate a CPP framework that:

1. Characterises directional movement and adhesion energy requirements.
2. Combines locomotion, suction, turning and cleaning in a total-energy model.
3. Simulates conventional complete-coverage trajectories on a rectangular glass façade.
4. Uses predicted energy as a criterion for selecting coverage trajectories.
5. Compares conventional and energy-aware paths while maintaining required coverage.
6. Evaluates model predictions against physical measurements when experiments are available.

## 3.4 Research hypothesis to investigate

A conventional path that minimises distance does **not necessarily** minimise electrical energy for a suction-based robot on vertical glass. An energy-aware planner may identify a path with lower total predicted energy by balancing direction of travel, turning and time-dependent adhesion costs.

This remains a **hypothesis for evaluation**, not a demonstrated result.

## 3.5 Intended evaluation

The report proposes comparing coverage rate, total energy, travel distance, number of turns, cleaning time, redundancy and tracking error. The final outcome should be based on simulated and measured values rather than illustrative tables.

**Next:** [Proposed Research Methodology](/research/methodology) or [Energy Model](/software/energy-model).

*Source: FYP report, Sections 2.4–2.6 (pp. 12–17).*
