import { Hono } from 'hono';
import { AuthContext } from '../middleware/auth';
import { requireAuth } from '../middleware/auth';
import { pregnancyModel } from '../db/database';
import { calculateGestationalAge, calculateEDDFromLMP } from '../utils/pregnancy';

const pregnancyRoutes = new Hono<{ Variables: AuthContext }>();

pregnancyRoutes.use('*', requireAuth);

pregnancyRoutes.get('/pregnancy', async (c) => {
  const user = c.get('user')!;
  const pregnancy = pregnancyModel.findByUserId(user.id);

  if (!pregnancy) {
    return c.json({ pregnancy: null });
  }

  const gestationalAge = calculateGestationalAge(pregnancy.expected_delivery_date);

  return c.json({
    pregnancy: {
      ...pregnancy,
      gestationalAge
    }
  });
});

pregnancyRoutes.post('/pregnancy', async (c) => {
  const user = c.get('user')!;
  const { expectedDeliveryDate, lastMenstrualPeriod } = await c.req.json<{
    expectedDeliveryDate?: string;
    lastMenstrualPeriod?: string;
  }>();

  let edd: string;

  if (expectedDeliveryDate) {
    edd = expectedDeliveryDate;
  } else if (lastMenstrualPeriod) {
    edd = calculateEDDFromLMP(lastMenstrualPeriod).toISOString().split('T')[0];
  } else {
    return c.json({ error: 'Either expected delivery date or last menstrual period is required' }, 400);
  }

  const existingPregnancy = pregnancyModel.findByUserId(user.id);
  if (existingPregnancy) {
    pregnancyModel.update(existingPregnancy.id, edd, lastMenstrualPeriod);
    return c.json({ success: true, pregnancyId: existingPregnancy.id, updated: true });
  }

  const pregnancyId = pregnancyModel.create(user.id, edd, lastMenstrualPeriod);
  return c.json({ success: true, pregnancyId, created: true });
});

pregnancyRoutes.put('/pregnancy', async (c) => {
  const user = c.get('user')!;
  const { expectedDeliveryDate, lastMenstrualPeriod } = await c.req.json<{
    expectedDeliveryDate?: string;
    lastMenstrualPeriod?: string;
  }>();

  const pregnancy = pregnancyModel.findByUserId(user.id);
  if (!pregnancy) {
    return c.json({ error: 'No pregnancy found' }, 404);
  }

  let edd: string;

  if (expectedDeliveryDate) {
    edd = expectedDeliveryDate;
  } else if (lastMenstrualPeriod) {
    edd = calculateEDDFromLMP(lastMenstrualPeriod).toISOString().split('T')[0];
  } else {
    return c.json({ error: 'Either expected delivery date or last menstrual period is required' }, 400);
  }

  pregnancyModel.update(pregnancy.id, edd, lastMenstrualPeriod);
  return c.json({ success: true });
});

pregnancyRoutes.delete('/pregnancy', async (c) => {
  const user = c.get('user')!;
  const pregnancy = pregnancyModel.findByUserId(user.id);

  if (!pregnancy) {
    return c.json({ error: 'No pregnancy found' }, 404);
  }

  pregnancyModel.delete(pregnancy.id);
  return c.json({ success: true });
});

export default pregnancyRoutes;