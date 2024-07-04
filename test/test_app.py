import unittest
from app import app

class BasicTests(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_compute(self):
        response = self.app.post('/compute', json={"input": 5})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {"result": 10})

if __name__ == "__main__":
    unittest.main()
