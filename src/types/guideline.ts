import { z } from 'zod';

export const guidelineSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  content: z.string().min(20, { message: 'Content must be at least 20 characters' }),
  categoryId: z.string().min(1, { message: 'Category is required' }),
  tags: z.array(z.string()).min(1, { message: 'At least one tag is required' }),
  references: z.array(
    z.object({
      title: z.string().min(1, { message: 'Reference title is required' }),
      url: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
      description: z.string().optional(),
    })
  ).optional(),
});

export type GuidelineFormValues = z.infer<typeof guidelineSchema>;
