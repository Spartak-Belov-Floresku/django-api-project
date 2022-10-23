"""
Tests for the ingredients API.
"""
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.urls import reverse
from django.test import TestCase

from rest_framework import status
from rest_framework.test import APIClient

from base.models import Ingredient, Recipe

from recipe.serializers import IngredientSerializer


INGREDIENTS_URL = reverse('recipe:ingredient-list')


def detail_url(ingredient_id):
    """Create and return an ingredient detail url."""
    return reverse('recipe:ingredient-detail', args=[ingredient_id])


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


def create_recipe(user, **params):
    """Create and return a sample recipe"""
    defaults = {
        'title': 'Sample recipe title',
        'time_minutes': 22,
        'price': Decimal('5.25'),
        'description': 'Sample description',
        'link': 'http://example.com/recipe.pdf'
    }
    defaults.update(params)

    return Recipe.objects.create(user=user, **defaults)


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

    def test_update_ingredient(self):
        """Test updating an ingredient."""
        ingredient = create_ingredient(user=self.user)

        payload = {'name': 'Coriander'}
        url = detail_url(ingredient.id)
        res = self.client.patch(url, payload, format='json')

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        ingredient.refresh_from_db()
        self.assertEqual(ingredient.name, payload['name'])

    def test_delete_ingredient(self):
        """Test deleting an ingredient."""
        ingredient = create_ingredient(user=self.user)

        url = detail_url(ingredient.id)
        res = self.client.delete(url)

        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        ingreadients = Ingredient.objects.filter(user=self.user)
        self.assertFalse(ingreadients.exists())

    def test_filter_ingrediets_assinged_to_recipes(self):
        """Test listing ingredients by those assigned to recipes."""
        in1 = create_ingredient(user=self.user, name='Apple')
        in2 = create_ingredient(user=self.user, name='Turkey')
        recipe = create_recipe(
            user=self.user,
            title='Apple Crumble',
            time_minutes=5,
            price=Decimal('4.50')
        )
        recipe.ingredients.add(in1)

        res = self.client.get(INGREDIENTS_URL, {'assigned_only': 1})

        s1 = IngredientSerializer(in1)
        s2 = IngredientSerializer(in2)

        self.assertIn(s1.data, res.data)
        self.assertNotIn(s2.data, res.data)

    def test_ingredients_unique(self):
        """Test filtered ingredients returns a unique list."""
        ing = create_ingredient(user=self.user, name='Eggs')
        create_ingredient(user=self.user, name='Lentils')
        recipe1 = create_recipe(
            user=self.user,
            title='Herb Eggs',
            time_minutes=20,
            price=Decimal('4.50')
        )
        recipe2 = create_recipe(
            user=self.user,
            title='Eggs Benedict',
            time_minutes=60,
            price=Decimal('7.00')
        )
        recipe1.ingredients.add(ing)
        recipe2.ingredients.add(ing)

        res = self.client.get(INGREDIENTS_URL, {'assigned_only': 1})

        self.assertEqual(len(res.data), 1)
