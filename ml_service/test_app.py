import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app


class MlServiceTests(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

    def test_health_endpoint(self):
        response = self.client.get('/health')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()['status'], 'ok')

    def test_conflict_prediction_works_without_model_files(self):
        response = self.client.post('/predict/conflict', json={
            'department': 'Road',
            'projectType': 'Infrastructure',
            'zone': 'Zone 1',
            'budgetLakhs': 120,
            'durationDays': 30,
            'weatherRisk': 7,
            'utilityDependency': 4,
            'contractorAvailability': 3,
            'resourceRequirement': 4,
        })
        self.assertEqual(response.status_code, 200)
        body = response.get_json()
        self.assertIn('conflictPrediction', body)
        self.assertIn('conflictProbability', body)

    def test_priority_prediction_works_without_model_files(self):
        response = self.client.post('/predict/priority', json={
            'department': 'Road',
            'projectType': 'Infrastructure',
            'zone': 'Zone 1',
            'budgetLakhs': 120,
            'durationDays': 30,
            'trafficDensity': 7,
            'weatherRisk': 7,
            'utilityDependency': 4,
            'populationDensity': 6,
            'criticalInfrastructure': 8,
            'citizenImpact': 7,
            'resourceRequirement': 4,
            'contractorAvailability': 3,
        })
        self.assertEqual(response.status_code, 200)
        body = response.get_json()
        self.assertIn('priorityPrediction', body)


if __name__ == '__main__':
    unittest.main()
