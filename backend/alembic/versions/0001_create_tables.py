"""create initial tables"""

from alembic import op
import sqlalchemy as sa

revision = '0001'
down_revision = None
branch_labels = None
depends_on = None

runstatus = sa.Enum('planned', 'completed', name='runstatus')


def upgrade():
    runstatus.create(op.get_bind())
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('hashed_password', sa.String(), nullable=False),
        sa.Column('first_name', sa.String(), nullable=True),
        sa.Column('last_name', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index('ix_users_email', 'users', ['email'], unique=True)

    op.create_table(
        'runs',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('name', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('copied_from', sa.Integer(), sa.ForeignKey('runs.id'), nullable=True),
        sa.Column('settings_snapshot', sa.JSON(), nullable=True),
        sa.Column('distance', sa.Float(), nullable=True),
        sa.Column('time', sa.Integer(), nullable=True),
        sa.Column('average_speed', sa.Float(), nullable=True),
        sa.Column('heart_rate', sa.Integer(), nullable=True),
        sa.Column('status', runstatus, nullable=False, server_default='completed'),
    )

    op.create_table(
        'strava_heart_rate_zone_cache',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('data', sa.JSON(), nullable=False),
        sa.Column('fetched_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        'strava_stats_cache',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('data', sa.JSON(), nullable=False),
        sa.Column('fetched_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        'strava_activities_cache',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('data', sa.JSON(), nullable=False),
        sa.Column('fetched_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )


def downgrade():
    op.drop_table('strava_activities_cache')
    op.drop_table('strava_stats_cache')
    op.drop_table('strava_heart_rate_zone_cache')
    op.drop_table('runs')
    op.drop_index('ix_users_email', table_name='users')
    op.drop_table('users')
    runstatus.drop(op.get_bind())

