// tests/unit/validator.test.ts
import { describe, it, expect } from 'vitest';
import { checkEmail, checkPassword, checkUsername } from '../../../src/utils/validator';

describe('Validator - checkEmail', () => {
  it('devrait accepter un email valide', () => {
    expect(checkEmail('test@example.com')).toBe(true);
    expect(checkEmail('user.name@domain.org')).toBe(true);
    expect(checkEmail('user+tag@gmail.com')).toBe(true);
  });

  it('devrait rejeter un email invalide', () => {
    expect(checkEmail('invalid')).toBe(false);
    expect(checkEmail('missing@')).toBe(false);
    expect(checkEmail('@nodomain.com')).toBe(false);
    expect(checkEmail('spaces in@email.com')).toBe(false);
    expect(checkEmail('')).toBe(false);
  });
});

describe('Validator - checkUsername', () => {
  it('devrait accepter un username de 6+ caractères', () => {
    expect(checkUsername('simeon')).toBe(true);
    expect(checkUsername('username123')).toBe(true);
    expect(checkUsername('aaaaaa')).toBe(true); // exactement 6
  });

  it('devrait rejeter un username de moins de 6 caractères', () => {
    expect(checkUsername('sim')).toBe(false);
    expect(checkUsername('12345')).toBe(false);
    expect(checkUsername('')).toBe(false);
    expect(checkUsername('aaaaa')).toBe(false); // 5 caractères
  });
});

describe('Validator - checkPassword', () => {
  it('devrait accepter un mot de passe fort', () => {
    // 8+ chars, 1 minuscule, 1 majuscule, 1 chiffre, 1 symbole
    expect(checkPassword('Password1!')).toBe(true);
    expect(checkPassword('MyStr0ng@Pass')).toBe(true);
    expect(checkPassword('C0mpl3x!Pwd')).toBe(true);
  });

  it('devrait rejeter un mot de passe sans majuscule', () => {
    expect(checkPassword('password1!')).toBe(false);
  });

  it('devrait rejeter un mot de passe sans minuscule', () => {
    expect(checkPassword('PASSWORD1!')).toBe(false);
  });

  it('devrait rejeter un mot de passe sans chiffre', () => {
    expect(checkPassword('Password!')).toBe(false);
  });

  it('devrait rejeter un mot de passe sans symbole', () => {
    expect(checkPassword('Password1')).toBe(false);
  });

  it('devrait rejeter un mot de passe trop court', () => {
    expect(checkPassword('Pass1!')).toBe(false);
    expect(checkPassword('')).toBe(false);
  });
});
