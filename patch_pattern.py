import json

with open('pattern_inventory.json', 'r') as f:
    data = json.load(f)

new_pattern = {
    "pattern_name": "Invariant_Verification_Harness",
    "type": "Epistemic_Architecture",
    "operational_definition": "Anomaly mining and Popperian falsification to parse descriptive laws into explanatory DAGs.",
    "measurement_proxy": "Akaike Information Criterion (AIC) optimization",
    "task_conditioned_baseline": "3-sigma predictive divergence triggers model breaking and automated de-idealization.",
    "falsification_condition": "Falsified if the harness relies on epicyclic curve-fitting rather than finding parsimonious invariants.",
    "expected_artifacts": [
        "Descriptive Law",
        "Explanatory DAG",
        "Boundary Limit Report"
    ]
}

data['patterns'].append(new_pattern)

with open('pattern_inventory.json', 'w') as f:
    json.dump(data, f, indent=2)
