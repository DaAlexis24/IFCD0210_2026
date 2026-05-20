import { z } from 'zod';
import { ReviewModelSchema } from './review.entity';


export const ProfileModelSchema = z.object({
    firstName: z.string(),
    surname: z.string(),
    avatar: z.string(),
});

export const ProfileRegisterModelSchema = z.object({
    firstName: z.string().min(1),
    surname: z.string().min(1),
    avatar: z.instanceof(File).optional(),
});

export const UserModelSchema = z.object({
    id: z.number(),
    email: z.string(),
    role: z.enum(['ADMIN', 'EDITOR', 'USER']),
    profile: ProfileModelSchema.optional(),
    reviews: z.array(ReviewModelSchema).optional(),

}); 

export const UserRegisterModelSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    role: z.literal('USER'),
    profile: ProfileRegisterModelSchema,
});

export const UserCredentialsModelSchema  = UserModelSchema.pick({
    id: true,
    email: true,
    role: true,
});

export const UserCredentialsFullModelSchema = UserCredentialsModelSchema.extend({
    password: z.string(),
});

export const UserModelWithProfile = UserModelSchema.extend({
    profile: ProfileModelSchema
});

export type Profile = z.infer<typeof ProfileModelSchema>;
export type ProfileRegister = z.infer<typeof ProfileRegisterModelSchema>;
export type UserRegister = z.infer<typeof UserRegisterModelSchema>;
export type UserCredentials = z.infer<typeof UserCredentialsModelSchema>;
export type FullUserCredentials =  z.infer<typeof UserCredentialsFullModelSchema>;
export type User =  z.infer<typeof UserModelSchema>;
export type UserWithProfile = z.infer<typeof UserModelWithProfile>;
