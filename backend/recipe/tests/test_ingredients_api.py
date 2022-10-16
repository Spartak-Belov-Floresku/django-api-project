"""
Tests for the ingredients API.
"""
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.test import TestCase

from rest_framework import status
from rest_framework.test import APIClient

from base.models import Ingredient

from recipe.serializers import IngredientSerializer


INGREDIENTS_URL = reverse('recipe:ingredient-list')


def create_user(**params):
    """Create and return a new user."""
    defaults = {
        'email': 'test@mail.com',
        'password': 'password123',
    }
    defaults.update(params)
    return get_user_model().objects.create_user(**defaults)


def create_ingredient(user, **params):
    """Create and return a new ingreadient."""
    defaults = {
        'name': 'Ingredient',
    }
    defaults.update(params)
    return Ingredient.objects.create(user=user, **defaults)


class PablecIngredientsApiTests(TestCase):
    """Test unathenticated API requests."""

    def setUp(self):
        self.client = APIClient()

    def test_auth_required(self):
        """Test auth is required for retrieving ingredients."""
        res = self.client.get(INGREDIENTS_URL)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateIngredientsApiTest(TestCase):
    """Test unathenticated API requests."""

    def setUp(self):
        self.user = create_user()
        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def test_retrieve_ingredients(self):
        """Test retrieving a list of ingredients."""
        create_ingredient(user=self.user, name='Kale')
        create_ingredient(user=self.user, name='Vanilla')

        res = self.client.get(INGREDIENTS_URL)

        ingredients = Ingredient.objects.all().order_by('-name')
        serializer = IngredientSerializer(ingredients, many=True)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_ingredients_limited_to_user(self):
        """Test list of ingredients is limited to authenticated user."""
        user2 = create_user(email='user2@mail.com')
        create_ingredient(user=user2)
        ingredient = create_ingredient(user=self.user, name='Pepper')

        res = self.client.get(INGREDIENTS_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)
        self.assertTrue(
            (res.data[0]['name'] == ingredient.name)
            and
            (res.data[0]['id'] == ingredient.id)
        )