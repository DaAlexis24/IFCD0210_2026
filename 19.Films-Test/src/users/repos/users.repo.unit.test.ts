import { type Mock, vi } from 'vitest';
import type { AppPrismaClient } from '../../config/db-config.ts';
import type {
    ProfileUpdateDTO,
    RegisterUserDTO,
    UserUpdateDTO,
} from '../entities/user.dto.ts';
import { UsersRepo } from './users.repo.ts';
import { AuthService } from '../../services/auth.ts';

describe('Given a instance of UsersRepo class', () => {
    let repo: UsersRepo;
    let prismaMock: AppPrismaClient;

    beforeEach(() => {
        prismaMock = {
            user: {
                findMany: vi.fn().mockResolvedValue([]),
                findUniqueOrThrow: vi.fn().mockResolvedValue({}),
                create: vi.fn().mockResolvedValue({}),
                update: vi.fn().mockResolvedValue({}),
                delete: vi.fn().mockResolvedValue({}),
            },
        } as unknown as AppPrismaClient;
        repo = new UsersRepo(prismaMock);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    // Arrange

    describe('When we instantiate it', () => {
        test('Then it should be defined', () => {
            // Act & Assert
            expect(repo).toBeDefined();
        });
        test('Then it should be a instance of UserRepo', () => {
            // Act & Assert
            expect(repo).toBeInstanceOf(UsersRepo);
        });
    });

    describe('When method register is called', () => {
        test('Then it return the registered user', async () => {
            // Arrange
            vi.spyOn(AuthService, 'hash').mockResolvedValue(
                'password-hasheada',
            );
            // Act
            const user = await repo.register({
                password: '123456',
            } as RegisterUserDTO);
            // Assert
            expect(user).toEqual({});
            expect(AuthService.hash).toHaveBeenCalled();
        });
    });

    describe('When method login is called', () => {
        test('Then it return the login result if user data are valid', async () => {
            // Arrange
            (prismaMock.user.findUniqueOrThrow as Mock).mockResolvedValueOnce({
                id: 1,
                email: 'test@example.com',
                password: 'hashed-password',
                role: 'USER',
            });
            vi.spyOn(AuthService, 'compare').mockResolvedValueOnce(true);

            // Act
            const result = await repo.login({
                email: 'test@example.com',
                password: '123456',
            });
            // Assert
            expect(result.credentials).toEqual({
                email: 'test@example.com',
                id: 1,
                role: 'USER',
            });
        });

        test('Then it return the login result if user data are NOT valid', async () => {
            // Arrange
            (prismaMock.user.findUniqueOrThrow as Mock).mockResolvedValueOnce({
                id: 1,
                email: 'test@example.com',
                password: await AuthService.hash('123456'),
                role: 'USER',
            });
            vi.spyOn(AuthService, 'compare').mockResolvedValueOnce(false);

            // Act & Assert
            await expect(
                repo.login({
                    email: 'test@example.com',
                    password: '123456',
                }),
            ).rejects.toThrow('Invalid user or password');
        });
    });

    describe('When method getAllUsers is called', () => {
        test('Then it return the array of users', async () => {
            // Act
            const users = await repo.getAllUsers();
            // Assert
            expect(users).toEqual([]);
            // Assert de implementación
            expect(prismaMock.user.findMany).toHaveBeenCalled();
        });
    });
    describe('When method getUserById is called', () => {
        describe('And the user with the given id exists', () => {
            test('Then it return the user', async () => {
                // Act
                const user = await repo.getUserById(1);
                // Assert de implementacion
                expect(prismaMock.user.findUniqueOrThrow).toHaveBeenCalled();
                // Assert
                expect(user).toEqual({});
            });
        });
        describe('And the user with the given id NOT exists', () => {
            test('Then it throw an error', async () => {
                // Arrange
                (
                    prismaMock.user.findUniqueOrThrow as Mock
                ).mockRejectedValueOnce(new Error('User not found'));
                // Act & Assert
                await expect(repo.getUserById(999)).rejects.toThrow(
                    'User not found',
                );
            });
        });
    });

    describe('When method updateUser is called', () => {
        describe('And the user with the given id exists', () => {
            test('Then it return the updated user', async () => {
                // Act
                const user = await repo.updateUser(1, {
                    password: '123456',
                } as UserUpdateDTO);
                // Assert
                expect(user).toEqual({});
            });
        });
        describe('And the user with the given id NOT exists', () => {
            test('Then it throw an error', async () => {
                // Arrange
                (prismaMock.user.update as Mock).mockRejectedValueOnce(
                    new Error('User not found'),
                );
                // Act & Assert
                await expect(
                    repo.updateUser(999, {} as UserUpdateDTO),
                ).rejects.toThrow('User not found');
            });
        });
    });

    describe('When method updateUserProfile is called', () => {
        describe('And the user with the given id exists', () => {
            test('Then it return the updated user', async () => {
                // Act
                const user = await repo.updateUserProfile(
                    1,
                    {} as ProfileUpdateDTO,
                );
                // Assert
                expect(user).toEqual({});
            });
        });
        describe('And the user with the given id NOT exists', () => {
            test('Then it throw an error', async () => {
                // Arrange
                (prismaMock.user.update as Mock).mockRejectedValueOnce(
                    new Error('User not found'),
                );
                // Act & Assert
                await expect(
                    repo.updateUserProfile(999, {} as ProfileUpdateDTO),
                ).rejects.toThrow('User not found');
            });
        });
    });

    describe('When method deleteUser is called', () => {
        describe('And the user with the given id exists', () => {
            test('Then it return the deleted user', async () => {
                // Act
                const user = await repo.deleteUser(1);
                // Assert
                expect(user).toEqual({});
            });
        });
        describe('And the user with the given id NOT exists', () => {
            test('Then it throw an error', async () => {
                // Arrange
                (prismaMock.user.delete as Mock).mockRejectedValueOnce(
                    new Error('User not found'),
                );
                // Act & Assert
                await expect(repo.deleteUser(999)).rejects.toThrow(
                    'User not found',
                );
            });
        });
    });
});
