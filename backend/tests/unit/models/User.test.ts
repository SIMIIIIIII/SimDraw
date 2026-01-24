// tests/unit/models/User.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import User from '@models/User';

describe('User Model', () => {
  
  describe('Création valide', () => {
    it('devrait créer un utilisateur avec les champs requis', async () => {
      const userData = {
        username: 'testuser',
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      };

      const user = await User.create(userData);

      expect(user._id).toBeDefined();
      expect(user.username).toBe('testuser');
      expect(user.name).toBe('Test User');
      expect(user.email).toBe('test@example.com');
      expect(user.password).toBe('Password123!');
      // Valeurs par défaut
      expect(user.admin).toBe(false);
      expect(user.emoji).toBe('1f600');
      expect(user.drawings).toEqual([]);
      // Timestamps
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    it('devrait convertir l\'email en minuscule', async () => {
      const user = await User.create({
        username: 'testuser2',
        name: 'Test',
        email: 'TEST@EXAMPLE.COM',
        password: 'Password123!',
      });

      expect(user.email).toBe('test@example.com');
    });

    it('devrait trim le username et name', async () => {
      const user = await User.create({
        username: '  trimmeduser  ',
        name: '  Trimmed Name  ',
        email: 'trim@test.com',
        password: 'Password123!',
      });

      expect(user.username).toBe('trimmeduser');
      expect(user.name).toBe('Trimmed Name');
    });
  });

  describe('Validation des champs requis', () => {
    it('devrait échouer sans username', async () => {
      const userData = {
        name: 'Test',
        email: 'test@test.com',
        password: 'Password123!',
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('devrait échouer sans email', async () => {
      const userData = {
        username: 'testuser',
        name: 'Test',
        password: 'Password123!',
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('devrait échouer sans password', async () => {
      const userData = {
        username: 'testuser',
        name: 'Test',
        email: 'test@test.com',
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('devrait échouer sans name', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@test.com',
        password: 'Password123!',
      };

      await expect(User.create(userData)).rejects.toThrow();
    });
  });

  describe('Validation du format', () => {
    it('devrait échouer avec un email invalide', async () => {
      const userData = {
        username: 'testuser',
        name: 'Test',
        email: 'invalid-email',
        password: 'Password123!',
      };

      await expect(User.create(userData)).rejects.toThrow(/Email invalide/);
    });

    it('devrait échouer avec un username trop court', async () => {
      const userData = {
        username: 'abc', // moins de 4 caractères
        name: 'Test',
        email: 'test@test.com',
        password: 'Password123!',
      };

      await expect(User.create(userData)).rejects.toThrow(/trop court/);
    });

    it('devrait échouer avec un password trop court', async () => {
      const userData = {
        username: 'testuser',
        name: 'Test',
        email: 'test@test.com',
        password: 'short', // moins de 8 caractères
      };

      await expect(User.create(userData)).rejects.toThrow(/trop court/);
    });
  });

  describe('Contraintes d\'unicité', () => {
    beforeEach(async () => {
      // Créer un utilisateur initial
      await User.create({
        username: 'existinguser',
        name: 'Existing',
        email: 'existing@test.com',
        password: 'Password123!',
      });
    });

    it('devrait échouer avec un username déjà utilisé', async () => {
      const userData = {
        username: 'existinguser', // déjà pris
        name: 'New User',
        email: 'new@test.com',
        password: 'Password123!',
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('devrait échouer avec un email déjà utilisé', async () => {
      const userData = {
        username: 'newuser',
        name: 'New User',
        email: 'existing@test.com', // déjà pris
        password: 'Password123!',
      };

      await expect(User.create(userData)).rejects.toThrow();
    });
  });

  describe('Champs optionnels', () => {
    it('devrait permettre de définir admin à true', async () => {
      const user = await User.create({
        username: 'adminuser',
        name: 'Admin',
        email: 'admin@test.com',
        password: 'Password123!',
        admin: true,
      });

      expect(user.admin).toBe(true);
    });

    it('devrait permettre de définir un emoji personnalisé', async () => {
      const user = await User.create({
        username: 'emojiuser',
        name: 'Emoji',
        email: 'emoji@test.com',
        password: 'Password123!',
        emoji: '1f60e', // 😎
      });

      expect(user.emoji).toBe('1f60e');
    });
  });
});
