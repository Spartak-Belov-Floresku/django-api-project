"""
Tests for models.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model


class ModelTests(TestCase):
    """Test models."""

    def test_craete_user_with_email_successful(self):
        """Test creating a user wiyth an email is successful."""
        email = 'test@mail.com'
        password = 'testpass123'
        user = get_user_model().objects.create_user(
            email=email,
            password=password,
        )

        self.assertEquals(user.email, email)
        self.assertTrue(user.check_password(password))

    def test_new_user_email_normalized(self):
        """Test email is normalized for new users."""
        sample_email = [
            ['test1@MAIL.com', 'test1@mail.com'],
            ['Test2@mail.com', 'Test2@mail.com'],
            ['TEST3@MAIL.COM', 'TEST3@mail.com'],
            ['test4@mail.COM', 'test4@mail.com'],
        ]

        for email, expected in sample_email:
            user = get_user_model().objects.create_user(email, 'password123')
            self.assertEqual(user.email, expected)

    def test_new_user_without_email_raises_error(self):
        """Test that creating a user without an email raises a ValueError."""
        with self.assertRaises(ValueError):
            get_user_model().objects.create_user('', 'password123')

    def test_create_superuser(self):
        """Test to create superuser."""
        user = get_user_model().objects.create_superuser(
            'test1@mail.com',
            'password123',
        )

        self.assertTrue(user.is_superuser)
        self.assertTrue(user.is_staff)
