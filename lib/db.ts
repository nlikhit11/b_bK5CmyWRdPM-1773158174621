import { Pool } from 'pg';
import type { User, Paper, TravelForm, AccommodationForm } from './types';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

export async function getClient() {
  return pool.connect();
}

// User operations
export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await query(
    'SELECT * FROM users WHERE email_id = $1',
    [email]
  );
  return result.rows[0] || null;
}

export async function getUserById(userId: string): Promise<User | null> {
  const result = await query(
    'SELECT * FROM users WHERE user_id = $1',
    [userId]
  );
  return result.rows[0] || null;
}

export async function createUser(user: Omit<User, 'created_at' | 'updated_at'>): Promise<User> {
  const result = await query(
    `INSERT INTO users (email_id, name, phone, gender, organization, country, registration_category, password_hash)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [user.email_id, user.name, user.phone, user.gender, user.organization, user.country, user.registration_category, user.password_hash]
  );
  return result.rows[0];
}

// Paper operations
export async function getPapersByUser(userId: string): Promise<Paper[]> {
  const result = await query(
    'SELECT * FROM papers WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
}

export async function createPaper(paper: Omit<Paper, 'paper_id' | 'created_at' | 'updated_at'>): Promise<Paper> {
  const result = await query(
    `INSERT INTO papers (user_id, paper_title, paper_pages)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [paper.user_id, paper.paper_title, paper.paper_pages]
  );
  return result.rows[0];
}

// Travel form operations
export async function getTravelFormByUser(userId: string): Promise<TravelForm | null> {
  const result = await query(
    'SELECT * FROM travel_form WHERE user_id = $1',
    [userId]
  );
  return result.rows[0] || null;
}

export async function createOrUpdateTravelForm(form: Omit<TravelForm, 'travel_id' | 'created_at' | 'updated_at'>): Promise<TravelForm> {
  const existing = await getTravelFormByUser(form.user_id);
  
  if (existing) {
    const result = await query(
      `UPDATE travel_form 
       SET travel_plan = $1, coming_from_which_state = $2, return_to_which_state = $3,
           arrival_date = $4, arrival_time = $5, departure_date = $6, departure_time = $7,
           train_no = $8, flight_no = $9, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $10
       RETURNING *`,
      [form.travel_plan, form.coming_from_which_state, form.return_to_which_state,
       form.arrival_date, form.arrival_time, form.departure_date, form.departure_time,
       form.train_no, form.flight_no, form.user_id]
    );
    return result.rows[0];
  }
  
  const result = await query(
    `INSERT INTO travel_form (user_id, travel_plan, coming_from_which_state, return_to_which_state,
                              arrival_date, arrival_time, departure_date, departure_time, train_no, flight_no)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [form.user_id, form.travel_plan, form.coming_from_which_state, form.return_to_which_state,
     form.arrival_date, form.arrival_time, form.departure_date, form.departure_time, form.train_no, form.flight_no]
  );
  return result.rows[0];
}

// Accommodation form operations
export async function getAccommodationByUser(userId: string): Promise<AccommodationForm | null> {
  const result = await query(
    'SELECT * FROM accommodation_form WHERE user_id = $1',
    [userId]
  );
  return result.rows[0] || null;
}

export async function createOrUpdateAccommodation(form: Omit<AccommodationForm, 'accommodation_id' | 'created_at' | 'updated_at'>): Promise<AccommodationForm> {
  const existing = await getAccommodationByUser(form.user_id);
  
  if (existing) {
    const result = await query(
      `UPDATE accommodation_form 
       SET hostel_needed = $1, hotel_info = $2, food_pref = $3, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $4
       RETURNING *`,
      [form.hostel_needed, form.hotel_info ? JSON.stringify(form.hotel_info) : null, form.food_pref, form.user_id]
    );
    return result.rows[0];
  }
  
  const result = await query(
    `INSERT INTO accommodation_form (user_id, hostel_needed, hotel_info, food_pref)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [form.user_id, form.hostel_needed, form.hotel_info ? JSON.stringify(form.hotel_info) : null, form.food_pref]
  );
  return result.rows[0];
}

export default pool;
