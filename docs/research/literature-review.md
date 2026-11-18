# 2. Literature Review

This review follows the dissertation's progression from **wall-climbing robot technologies** to **coverage path planning**, **energy consumption**, and the motivation for an energy-aware planner for vertical glass cleaning.

## 2.1 Wall-climbing robots and adhesion technologies

### 2.1.1 Applications and challenges

Wall-climbing robots are investigated for high-rise façade cleaning, structural inspection, bridge maintenance, ship-hull inspection and industrial surface maintenance. Such robots can potentially reduce the need for people to work directly at height. Unlike ground robots, they must maintain adequate adhesion while moving and while stationary.

The report identifies recurring challenges: limited load-carrying capacity, short operating duration, detachment risk, excessive robot mass and limited flexibility of motion mechanisms.

### 2.1.2 Comparison of adhesion mechanisms

| Mechanism | Appropriate surface | Advantage | Limitation for this project |
| --- | --- | --- | --- |
| Negative-pressure suction | Smooth, non-porous surfaces | Suitable for glass | Requires continuous or periodic vacuum generation |
| Magnetic adhesion | Ferromagnetic surfaces | Strong attachment | Not suitable for ordinary glass |
| Dry or wet adhesion | Surface-dependent | Potential for lightweight systems | Adhesion depends on surface condition |
| Claw or hook adhesion | Rough or porous surfaces | Strong mechanical grip | Not suitable for smooth glass |

The proposed robot uses **negative-pressure suction** because the intended operating surface is glass. This introduces an energy cost that may continue even when the robot is not moving.

### 2.1.3 Operating duration and energy consumption

Battery-powered operating duration depends on usable energy and the electrical power consumed by locomotion, adhesion and cleaning. In an active negative-pressure system, suction can consume energy throughout the cleaning operation. A longer path duration may therefore increase total energy even if the distance is short.

The report's initial energy breakdown is:

\[
E_{\mathrm{total}} = E_{\mathrm{loc}} + E_{\mathrm{adh}} + E_{\mathrm{turn}} + E_{\mathrm{clean}}
\]

A later modelling iteration proposes accounting for changing robot mass, for example when cleaning liquid is consumed. That extension is **future modelling work**, not part of the first simulation.

### 2.1.4 Detachment risk and safety

Potential causes of detachment include insufficient suction, vacuum leakage, power failure, excessive payload, surface irregularities and abrupt manoeuvres. The report discusses possible mitigations such as pressure monitoring, backup power or adhesion, and controlled acceleration. These are safety considerations, not confirmed features of the current prototype.

## 2.2 Coverage Path Planning for cleaning robots

CPP aims to cover the accessible workspace without leaving uncleaned gaps. The report discusses several candidate patterns:

| Strategy | General movement pattern | Relevance to comparison |
| --- | --- | --- |
| Horizontal sweep | Repeated horizontal passes with vertical transitions | Different horizontal/upward/downward travel balance |
| Vertical sweep | Repeated vertical passes with horizontal transitions | Different vertical travel balance |
| Spiral | Progressively inward or outward turns | Different turn frequency and route geometry |
| Boustrophedon / reciprocating | Alternating back-and-forth passes | Conventional complete-coverage baseline |

Boustrophedon cellular decomposition is also discussed as an approach for dividing more complicated free spaces into cells. However, the project's initial scenario assumes **no obstacles**, so a simpler rectangular coverage comparison is appropriate as a starting point.

### Why coverage alone is insufficient

A path may achieve complete coverage but differ in distance, direction of motion, number of turns and total operating time. Because a suction-based climbing robot must remain attached throughout its operation, these differences can produce different energy demands.

## 2.3 Energy consumption in vertical robots

Gravity makes the cost of motion direction-dependent. The report proposes distinguishing:

- **Upward travel:** motors must work against gravity and increase gravitational potential energy.
- **Downward travel:** gravity assists motion, although controlled descent and friction still require energy.
- **Horizontal travel:** there is no net change in gravitational potential energy, but the robot must overcome locomotion and adhesion-related resistance.
- **Turning:** reorientation can introduce additional energy and time.
- **Adhesion and cleaning:** subsystems may consume power throughout operation.

The actual energy-per-metre values must be **measured**; the report cautions against assuming they are identical or assuming a fixed relationship before testing.

## 2.4 Energy-aware Coverage Path Planning

Conventional CPP often focuses on achieving coverage while minimising path length or completion time. The proposed research instead seeks to **minimise predicted total energy while maintaining complete coverage**.

The proposed performance indicators are coverage rate, total energy, path length, repeated coverage, number of turns, completion time and tracking error.

## 2.5 Comparison of existing research

The following table summarises the comparisons presented in the report. It is a working literature synthesis; full bibliographic details should be verified against the original papers before academic submission.

| Research discussed | Main approach | Relevance and limitation |
| --- | --- | --- |
| Bisht et al., glass-façade cleaning robot | Comparison of horizontal and vertical coverage strategies | Relevant glass-cleaning baseline; limited treatment of direction-dependent energy |
| Energy-efficient CPP for a reconfigurable robot | Cell decomposition, clustering and energy-focused planning | Shows explicit energy optimisation, but not continuous adhesion on glass |
| Rope-driven glass-curtain-wall cleaning robot | Grid and reciprocating coverage with dead-zone recovery | Useful coverage baseline; energy optimisation is not the primary focus |
| Chen et al. (2025), wind-turbine blade wall-climbing robot | Bio-inspired neural-network planning and an energy model | Relevant vertical energy-aware CPP, but for curved turbine blades rather than flat glass |
| Zhang et al. (2025), biped window-cleaning robot | Hierarchical planning with deep Q-network methods | Demonstrates sophisticated window-cleaning navigation; not focused on total electrical-energy minimisation |

### Selected reading links recorded in the report

- [Review of wall-climbing robots — *Machines* (2025)](https://www.mdpi.com/2075-1702/13/6/521)
- [Bio-inspired wall-climbing robot research — Springer](https://link.springer.com/article/10.1007/s42235-025-00689-6)
- [Early low-cost window-cleaning robot study — ScienceDirect](https://www.sciencedirect.com/science/article/pii/S1877050918309682)
- [Boustrophedon cellular decomposition — Choset (1997)](https://publications.ri.cmu.edu/storage/publications/pub_files/pub1/choset_howie_1997_5/choset_howie_1997_5.pdf)
- [Wall-climbing CPP research — *Machines*](https://www.mdpi.com/2075-1702/13/3/180)

These links are retained from the research notes and are **not** a completed, verified reference list.

## 2.6 Literature synthesis

The reviewed research establishes that complete coverage is achievable using multiple path-planning methods and that energy-aware planning is relevant to mobile and climbing robots. The specific opportunity identified by the report is to combine **direction-dependent locomotion, continuous suction, turning and cleaning energy** in a practical CPP comparison for a low-cost robot on flat vertical glass.

**Next:** [Research Gap and Proposed Contribution](/research/research-gap).

*Source: FYP report, Section 2 (pp. 3–17).*
