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

    def test_recommendations_model(self):
        response = self.client.post('/predict/recommendations', json={
            'department': 'Road',
            'zone': 'Zone 5',
            'conflictProbability': 0.85,
            'priorityPrediction': 'High',
        })
        self.assertEqual(response.status_code, 200)
        body = response.get_json()
        self.assertIn('explanations', body)
        self.assertIn('recommendations', body)
        self.assertTrue(len(body['recommendations']) > 0)

    def test_resource_optimization_model(self):
        response = self.client.post('/predict/resource-optimization', json={
            'department': 'Water',
            'zone': 'Zone 5',
            'budgetLakhs': 50,
        })
        self.assertEqual(response.status_code, 200)
        body = response.get_json()
        self.assertIn('optimizationCards', body)
        self.assertEqual(body['status'], 'OPTIMIZED')

    def test_media_verification_model(self):
        # 1. Authentic Image Test
        res1 = self.client.post('/predict/media-verification', json={
            'fileName': 'pothole_evidence.png',
            'mediaType': 'IMAGE',
            'fileSize': 150000
        })
        self.assertEqual(res1.status_code, 200)
        body1 = res1.get_json()
        self.assertEqual(body1['verificationStatus'], 'AUTHENTIC')
        self.assertGreaterEqual(body1['authenticityScore'], 90)

        # 2. Authentic Video Test
        res2 = self.client.post('/predict/media-verification', json={
            'fileName': 'road_damage_recording.mp4',
            'mediaType': 'VIDEO',
            'fileSize': 15000000
        })
        self.assertEqual(res2.status_code, 200)
        body2 = res2.get_json()
        self.assertEqual(body2['mediaType'], 'VIDEO')
        self.assertEqual(body2['verificationStatus'], 'AUTHENTIC')

        # 3. Suspicious / Fake Media Test
        res3 = self.client.post('/predict/media-verification', json={
            'fileName': 'fake_ai_generated_street.jpg',
            'mediaType': 'IMAGE',
            'fileSize': 1000
        })
        self.assertEqual(res3.status_code, 200)
        body3 = res3.get_json()
        self.assertEqual(body3['verificationStatus'], 'SUSPICIOUS')
        self.assertLessEqual(body3['authenticityScore'], 50)


if __name__ == '__main__':
    unittest.main()
