CREATE TABLE user(
    vk_id Integer PRIMARY KEY,
    group_id Integer
    FOREIGN KEY (group_id) REFERENCES group (group_id),
    subgroup_id Integer,
    FOREIGN KEY (subgroup_id) REFERENCES subgroup (subgroup_id)
)

CREATE TABLE group(
    group_id SERIAL PRIMARY KEY,
    group_name VARCHAR(20),
    headman_vk_id INTEGER,
    general_timetable JSONB
)

CREATE TABLE subgroup(
    subgroup_id SERIAL PRIMARY KEY,
    subgroup_name VARCHAR(40),
    group_id Integer,
    FOREIGN KEY (group_id) REFERENCES group (group_id),
    subgroup_timetable JSON
)