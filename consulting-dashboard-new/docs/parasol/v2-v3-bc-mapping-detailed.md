# V2-to-V3 Business Capability Detailed Mapping

**Document**: Detailed service-by-service and capability-by-capability mapping  
**Updated**: 2025-10-31  
**Status**: Migration Planning

---

## Executive Summary

| Aspect | V2 | V3 | Impact |
|--------|-----|-----|--------|
| **Services** | 7 | 7 BCs | Rebranding to value-focus |
| **Capabilities** | 24 | 22-24 L3s | Consolidation of redundancy |
| **Operations** | 77 | 60-71 | 12-18% reduction |
| **Duplicates Found** | 3-5 | Consolidated | Quality improvement |

---

## Detailed Service Mapping

### 1. COLLABORATION-FACILITATION-SERVICE → BC#7: Team Communication & Collaboration

**Service Level Mapping**:
- **V2 Service Purpose**: Enable real-time communication and collaboration
- **V3 BC Purpose**: Enable real-time communication, coordination, and information sharing
- **Alignment**: 100% (purpose matches)

**Capability-Level Mapping**:

| V2 Capability | V2 Operations | V3 L3 Capability | V3 Operations | Notes |
|--------------|---------------|-----------------|--------------|-------|
| communication-delivery | facilitate-communication, manage-meetings, send-notification | **Synchronous Communication** | facilitate-communication, manage-meetings | Core operations |
| communication-delivery | send-notification (partial) | **Asynchronous Communication & Notifications** | send-notification (general), deliver-notifications (urgent) | Split by SLA |
| deliver-immediate-information | deliver-notifications | **Asynchronous Communication & Notifications** | deliver-notifications | Consolidation |
| provide-collaborative-environment | provide-collaborative-environment | **Collaborative Workspace** | provide-collaborative-environment | L4 (supporting) |

**Consolidation Actions**:
- **MERGE**: deliver-immediate-information is absorbed into send-notification (both notifications)
- **SPLIT**: send-notification split into general (async) vs. urgent (immediate)
- **RESULT**: 3 V2 capabilities → 2-3 L3 capabilities (20-30% reduction)

**Estimated Operations**:
- V2: 5 operations
- V3: 4-5 operations (slight reduction)

---

### 2. KNOWLEDGE-CO-CREATION-SERVICE → BC#6: Knowledge Management & Organizational Learning

**Service Level Mapping**:
- **V2 Service Purpose**: Capture, organize, and leverage organizational knowledge
- **V3 BC Purpose**: Capture, organize, and leverage organizational knowledge to improve delivery
- **Alignment**: 95% (V3 adds "to improve delivery" context)

**Capability-Level Mapping**:

| V2 Capability | V2 Operations | V3 L3 Capability | V3 Operations | Notes |
|--------------|---------------|-----------------|--------------|-------|
| knowledge-management | capture-knowledge, organize-knowledge, validate-knowledge | **Knowledge Capture & Organization** | capture-knowledge, organize-knowledge, validate-knowledge | L3 - creation phase |
| knowledge-management | search-knowledge, apply-knowledge, share-knowledge | **Knowledge Discovery & Application** | search-knowledge, apply-knowledge, share-knowledge | L3 - utilization phase |

**Consolidation Actions**:
- **SPLIT**: Single capability split into 2 L3 capabilities (creation vs. utilization)
- **PRESERVE**: All 6 operations intact (no consolidation needed)
- **ADD**: Could add "Best Practice Extraction" as optional L3
- **RESULT**: 1 V2 capability → 2-3 L3 capabilities (expansion for clarity)

**Estimated Operations**:
- V2: 6 operations
- V3: 6 operations (unchanged, but better organized)

---

### 3. PRODUCTIVITY-VISUALIZATION-SERVICE → BC#5: Team & Resource Optimization

**Service Level Mapping**:
- **V2 Service Purpose**: Track and visualize team productivity and resource utilization
- **V3 BC Purpose**: Maximize team productivity and resource utilization across projects
- **Alignment**: 90% (V3 shifts from "visualize" to "optimize")

**Capability-Level Mapping**:

| V2 Capability | V2 Operations | V3 L3 Capability | V3 Operations | Notes |
|--------------|---------------|-----------------|--------------|-------|
| workload-tracking | record-time, approve-timesheet, analyze-utilization | **Resource Planning & Allocation** | record-time, approve-timesheet, analyze-utilization | Moved to BC#5 from standalone |

**Consolidation Actions**:
- **ELEVATION**: workload-tracking (3 small operations) elevated and merged into larger BC
- **CONSOLIDATE**: Can merge with talent-optimization resource operations
- **RATIONALE**: Too small to be independent service; belongs with resource optimization
- **RESULT**: Independent service → L3 capability within BC#5

**Estimated Operations**:
- V2: 3 operations (standalone)
- V3: 0 operations (merged into BC#5), but contributes 3 sub-operations to "Resource Planning & Allocation"

---

### 4. PROJECT-SUCCESS-SERVICE → BC#1: Project Delivery & Quality Management

**Service Level Mapping**:
- **V2 Service Purpose**: End-to-end project delivery with quality, risk, and progress management
- **V3 BC Purpose**: Ensure projects are delivered on-time, on-budget, with high quality and managed risks
- **Alignment**: 98% (excellent match)

**Capability-Level Mapping**:

| V2 Capability | V2 Operations | V3 L3 Capability | V3 Operations | Notes |
|--------------|---------------|-----------------|--------------|-------|
| plan-and-structure-project | decompose-and-define-tasks, optimally-allocate-resources | **Project Planning & Structure** | decompose-and-define-tasks, optimally-allocate-resources | L3 planning phase |
| plan-and-execute-project | launch-project, execute-and-monitor-project, complete-and-evaluate-project | **Project Execution & Delivery** | launch-project, execute-and-monitor-project, complete-and-evaluate-project | L3 execution |
| manage-and-complete-tasks | decompose-and-define-tasks, assign-and-execute-tasks, track-task-progress | **Task & Work Management** | assign-and-execute-tasks, track-task-progress (+ shared decompose-and-define-tasks) | L3 tactical |
| manage-and-ensure-deliverable-quality | define-and-create-deliverables, review-and-approve-deliverables, version-control-deliverables | **Deliverable Quality Assurance** | define-and-create-deliverables, review-and-approve-deliverables, version-control-deliverables | L3 quality |
| monitor-and-ensure-quality | visualize-and-control-progress | **Risk & Issue Management** (merged) | visualize-and-control-progress (merged with risk) | Can merge with progress tracking |
| foresee-and-handle-risks | identify-and-assess-risks, monitor-and-handle-risks, plan-risk-response | **Risk & Issue Management** | identify-and-assess-risks, monitor-and-handle-risks, plan-risk-response | L3 risk |

**Consolidation Actions**:
- **CONSOLIDATE**: 6 V2 capabilities → 5 L3 capabilities (remove 1 through merging)
- **IDENTIFY DUPLICATE**: "decompose-and-define-tasks" appears in plan-and-structure-project AND manage-and-complete-tasks
  - **FIX**: Consolidate into single "Project Planning & Structure" L3, reused by task management
- **MERGE**: monitor-and-ensure-quality (single operation) merged with risk management
- **RESULT**: 6 V2 capabilities → 5 L3 capabilities (17% reduction)

**Estimated Operations**:
- V2: 11 operations (+ 1 duplicate = 12 total lines)
- V3: 10 unique operations (consolidated duplicate)

---

### 5. REVENUE-OPTIMIZATION-SERVICE → BC#2: Financial Health & Profitability

**Service Level Mapping**:
- **V2 Service Purpose**: Financial health through revenue and cost optimization
- **V3 BC Purpose**: Optimize revenue, control costs, and maximize profitability
- **Alignment**: 100% (perfect match)

**Capability-Level Mapping**:

| V2 Capability | V2 Operations | V3 L3 Capability | V3 Operations | Notes |
|--------------|---------------|-----------------|--------------|-------|
| formulate-and-control-budget | formulate-budget, approve-and-finalize-budget, monitor-and-control-budget, revise-and-reallocate-budget | **Budget Planning & Control** | formulate-budget, approve-and-finalize-budget, monitor-and-control-budget, revise-and-reallocate-budget | L3 budget mgmt |
| control-and-optimize-costs | record-and-categorize-costs, analyze-cost-trends, allocate-and-optimize-costs | **Cost Management & Optimization** | record-and-categorize-costs, analyze-cost-trends, allocate-and-optimize-costs | L3 cost mgmt |
| recognize-and-maximize-revenue | recognize-and-record-revenue, forecast-and-maximize-revenue, issue-invoice-and-manage-collection | **Revenue & Cash Flow Management** | recognize-and-record-revenue, forecast-and-maximize-revenue, issue-invoice-and-manage-collection | L3 revenue |
| analyze-and-improve-profitability | calculate-profitability, analyze-profitability-trends, forecast-and-optimize-cashflow, propose-improvement-actions | **Profitability Analysis & Optimization** | calculate-profitability, analyze-profitability-trends, forecast-and-optimize-cashflow, propose-improvement-actions | L3 analysis |
| optimize-profitability | optimize-profitability, track-revenue | **Profitability Analysis & Optimization** (merged) | optimize-profitability (merged), track-revenue (merged to Revenue Management) | CONSOLIDATION |

**Consolidation Actions**:
- **CONSOLIDATE**: 5 V2 capabilities → 4 L3 capabilities (25% reduction)
- **IDENTIFY REDUNDANCY**: optimize-profitability capability is redundant with analyze-and-improve-profitability
  - **FIX**: Merge "optimize-profitability" operation into "Profitability Analysis & Optimization" L3
  - **FIX**: Move "track-revenue" operation to "Revenue & Cash Flow Management" L3
- **RESULT**: 5 V2 capabilities → 4 L3 capabilities, 16 operations → 14 operations

**Estimated Operations**:
- V2: 16 operations (with 2 redundant)
- V3: 14 operations (consolidated)

---

### 6. SECURE-ACCESS-SERVICE → BC#3 + BC#4

**Service Level Mapping**:
- **V2 Service Purpose**: Authentication, authorization, and security governance
- **V3 BC Split**:
  - **BC#3**: Access Control & Security (3 L3 capabilities, 9 operations)
  - **BC#4**: Organizational Structure & Governance (1-2 L3 capabilities, 3 operations)
- **Alignment**: 95% (split for strategic organization)

**Capability-Level Mapping** (for BC#3 primarily):

| V2 Capability | V2 Operations | V3 L3 Capability | V3 BC | V3 Operations | Notes |
|--------------|---------------|-----------------|-------|--------------|-------|
| authenticate-and-manage-users | register-and-authenticate-users, manage-passwords, implement-multi-factor-authentication | **Identity & Authentication** | BC#3 | register-and-authenticate-users, manage-passwords, implement-multi-factor-authentication | Security L3 |
| control-access-permissions | define-roles-and-permissions, grant-and-manage-permissions, audit-and-review-permissions | **Authorization & Access Control** | BC#3 | define-roles-and-permissions, grant-and-manage-permissions, audit-and-review-permissions | Security L3 |
| manage-organizational-structure | define-and-build-organization, visualize-organizational-hierarchy, change-and-reorganize-structure | **Organization Design & Structure** | BC#4 | define-and-build-organization, visualize-organizational-hierarchy, change-and-reorganize-structure | Governance L3 |
| audit-and-assure-security | audit-log-management, compliance-monitoring, security-event-detection | **Audit, Compliance & Governance** | BC#3 | audit-log-management, compliance-monitoring, security-event-detection | Security L3 |

**Consolidation Actions**:
- **SPLIT SERVICE**: Recognize that organization structure is a governance function, not purely security
- **CREATE BC#4**: Independent BC for organizational governance
- **RESULT**: 1 V2 service → 2 V3 BCs (4 V2 capabilities → 4 L3 capabilities, no reduction but improved separation)

**Estimated Operations**:
- V2: 12 operations (single service)
- V3: 12 operations (split across 2 BCs for clarity)

---

### 7. TALENT-OPTIMIZATION-SERVICE → BC#5: Team & Resource Optimization

**Service Level Mapping**:
- **V2 Service Purpose**: Optimize team composition, skills, and resource allocation
- **V3 BC Purpose**: Maximize team productivity and resource utilization across projects
- **Alignment**: 98% (excellent match)

**Capability-Level Mapping**:

| V2 Capability | V2 Operations | V3 L3 Capability | V3 Operations | Notes |
|--------------|---------------|-----------------|--------------|-------|
| optimally-allocate-resources | allocate-resources, forecast-resource-demand, optimize-resource-utilization | **Resource Planning & Allocation** | allocate-resources, forecast-resource-demand, optimize-resource-utilization | L3 resource mgmt |
| form-and-optimize-teams | form-teams, optimize-team-composition, monitor-team-performance | **Team Formation & Composition** | form-teams, optimize-team-composition, monitor-team-performance | L3 team mgmt |
| manage-and-develop-members | register-and-manage-members, evaluate-performance, develop-and-support-career | **Talent Development & Performance** | register-and-manage-members, evaluate-performance, develop-and-support-career | L3 talent mgmt |
| execute-skill-development | execute-skill-development | **Capability & Skill Development** (merged) | (merged into visualize-and-develop-skills) | L4 skill execution |
| visualize-and-develop-skills | analyze-skill-gaps, create-skill-matrix, execute-skill-development | **Talent Development & Performance** (merged) | analyze-skill-gaps, create-skill-matrix, execute-skill-development | L3 skill development |

**Consolidation Actions**:
- **CONSOLIDATE**: 5 V2 capabilities → 4 L3 capabilities (20% reduction)
- **IDENTIFY DUPLICATE**: "execute-skill-development" appears in 2 places
  - **FIX**: Single "execute-skill-development" operation consolidated; primary location in visualize-and-develop-skills
- **MERGE**: execute-skill-development (single operation) merged into visualize-and-develop-skills
- **COMBINE**: "Talent Development & Performance" merges develop-and-support-career with skill development
- **RESULT**: 5 V2 capabilities → 4 L3 capabilities, 13 operations → 12 operations

**Estimated Operations**:
- V2: 13 operations (+ 1 duplicate)
- V3: 12 operations (consolidated)

---

## Summary Table: All Services Mapping

| V2 Service | V2 Caps | V2 Ops | V3 BC | V3 L3s | V3 Ops | % Change |
|-----------|---------|--------|--------|--------|--------|----------|
| collaboration-facilitation | 3 | 5 | BC#7 | 2-3 | 4-5 | -20% ops |
| knowledge-co-creation | 1 | 6 | BC#6 | 2-3 | 6 | 0% ops |
| productivity-visualization | 1 | 3 | BC#5 | (merged) | 3 | -90% as service |
| project-success | 6 | 11 (+1 dup) | BC#1 | 5 | 10 | -9% ops |
| revenue-optimization | 5 | 16 (+2 dup) | BC#2 | 4 | 14 | -12% ops |
| secure-access | 4 | 12 | BC#3+4 | 4 | 12 | 0% ops |
| talent-optimization | 5 | 13 (+1 dup) | BC#5 | 4 | 12 | -8% ops |
| **TOTAL** | **24** | **77 (+4 dup)** | **7 BCs** | **22-24** | **60-71** | **-12% ops** |

---

## Impact Analysis

### Positive Impacts

1. **Consolidation Efficiency**: 12-18% reduction in operations through removal of duplicates
2. **Clarity**: Operations-level duplicates (decompose-and-define-tasks, execute-skill-development, etc.) eliminated
3. **Value Alignment**: Service names change from function-centric to value-centric
4. **Better Grouping**: Related capabilities consolidated (e.g., team + resource = BC#5)
5. **Scalability**: Clearer boundaries make future evolution easier

### Challenges

1. **Productivity-Visualization absorption**: Lose independent service identity (mitigated by L3 capability)
2. **Org Structure relocation**: Moving from pure security to governance BC (architectural change)
3. **Interdependency**: BC#1 (projects) depends on BC#3 (security) and BC#5 (resources) heavily
4. **Knowledge service**: Remains smaller than others (6 ops) - may not justify independent service long-term

### Risk Areas

1. **Project Service**: Largest BC (12-15 ops), may need further refinement
2. **Duplication Not Obvious**: Some duplicates may not be exact matches (require careful review)
3. **Cross-Capability Dependencies**: Some operations serve multiple L3 capabilities

---

## Validation Checklist

- [ ] All 77 V2 operations mapped to V3
- [ ] All duplicates identified and consolidated
- [ ] All L3 capabilities have 1-4 operations (complexity check)
- [ ] Each BC has 3-5 L3 capabilities (scope check)
- [ ] No circular dependencies between BCs
- [ ] Operation naming consistent within each L3 capability
- [ ] V3 BC names are value-based, not function-based
- [ ] Migration path identified for each service

---

## Next Steps

1. **Design Review**: Share mapping with architecture team for validation
2. **Detailed BC Documents**: Create comprehensive BC definition docs in v2.0 format
3. **Implementation Planning**: Create detailed migration roadmap with timelines
4. **Risk Mitigation**: Identify and plan for identified challenges
5. **Stakeholder Communication**: Brief service owners on changes

