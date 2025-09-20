Given the following schema, please create a new supabase schema that supports the main "season" domain object.

Here is what a sqlite schema looks like from our previous applicaton, and this will need to be converted to the relevant supabase migration. Look in the @migrations/ directory to ensure that the appropriate triggers are added too.

Here is the schema for a season:
export const seasons = sqliteTable('seasons', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  priority: text('priority', { enum: seasonPriorityEnum }).notNull(),
  durationWeeks: integer('duration_weeks'),
  motivation: text('motivation'), // Serialized JSON
  status: text('status', { enum: ['draft', 'active', 'completed', 'archived', 'paused', 'cancelled'] }).notNull().default('draft'),
  startDate: integer('start_date', { mode: 'timestamp' }),
  endDate: integer('end_date', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().defaultNow(),
});


// New Table: Metrics
export const metrics = sqliteTable('metrics', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    unitType: text('unit_type', { enum: metricUnitTypeEnum }).notNull(),
    defaultUnit: text('default_unit', { enum: metricDefaultUnitEnum }).notNull(),
    alternativeUnits: text('alternative_units').notNull().default('[]'),
    dataType: text('data_type', { enum: metricDataTypeEnum }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().defaultNow(),
  });

// New Table: seasonMetricGoals (Stores target values/goals for specific metrics in a season)
export const seasonMetricGoals = sqliteTable('season_metric_goals', {
    id: text('id').primaryKey(),
    seasonId: text('season_id').notNull().references(() => seasons.id, { onDelete: 'cascade' }),
    metricId: text('metric_id').notNull().references(() => metrics.id, { onDelete: 'cascade' }),
    goalValue: real('target_value').notNull(), // Value in user's preferred unit
    goalUnit: text('target_unit', { enum: metricDefaultUnitEnum }).notNull(), // Unit user entered
    canonicalValue: real('canonical_value').notNull(), // Value converted to metric's default unit
    startValue: real('start_value'), // Optional starting baseline value
    startUnit: text('start_unit', { enum: metricDefaultUnitEnum }), // Unit for start value
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().defaultNow(),
  }, (table) => ({
    uniqueConstraint: unique().on(table.seasonId, table.metricId),
  }));

  // New Table: seasonSelectedMetrics (Links Seasons to their chosen Key Metrics)
export const seasonSelectedMetrics = sqliteTable('season_selected_metrics', {
    id: text('id').primaryKey(),
    seasonId: text('season_id').notNull().references(() => seasons.id, { onDelete: 'cascade' }),
    metricId: text('metric_id').notNull().references(() => metrics.id, { onDelete: 'cascade' }), 
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow(),
  }, (table) => ({
    uniqueConstraint: unique().on(table.seasonId, table.metricId),
  }));

  export const seasonsRelations = relations(seasons, ({ many }) => ({
    selectedMetrics: many(seasonSelectedMetrics),
    metricGoals: many(seasonMetricGoals),
  }));

// Enum for season purpose
export const seasonPriorityEnum = ['fat_loss', 'muscle_gain', 'strength', 'endurance', 'maintenance'] as const;

// Enum for metric unit types
export const metricUnitTypeEnum = ['weight', 'distance', 'time', 'reps', 'percentage', 'other'] as const;
export const metricDefaultUnitEnum = ['kg', 'lbs', 'cm', 'inches', 'meters', 'km', 'miles', 'seconds', 'minutes', 'count', 'percent_value', 'custom_unit'] as const;
export const metricDataTypeEnum = ['decimal', 'integer'] as const;

Note - A season itself will at some point have other pillars - for example, right now I'm running a paper based version, and the paper based version has me focussing on these pillars: Health and Fitness (our focus right now), Wealth, Family, Head Game, Career. Each of those pillars has some specific priorities and goals. PLease make sure you account for this in the schema and allow it to be easily extensible.

Each season will have a specific set of metrics that can be used to measure progress against goals.

Before defining the schema, please review the existing schema and the domain model for the season. Then, think about whether the schema needs to change based on the domain - please ask as many questions as needed to ensure you understand the domain and the schema.

Only once you have a clear understanding of the domain and schema, and I think you have a good plan will we move on to defining something.