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

-- создать стоблец и внешний ключ
ALTER TABLE public.students_group ADD COLUMN faculty_id INTEGER
ALTER TABLE public.students_group ADD CONSTRAINT faculty_id
FOREIGN KEY (faculty_id) REFERENCES faculty (faculty_id) MATCH FULL;

CREATE OR REPLACE PROCEDURE createStudent(_vk_id INTEGER, _subgroup_id INTEGER)
LANGUAGE plpgsql
AS $$
BEGIN
	IF (
		EXISTS (
			SELECT * FROM public.subgroup as sg
			WHERE sg.subgroup_id = _subgroup_id
		)
		AND
		NOT EXISTS(
			SELECT * FROM public.student as student
			WHERE student.vk_id = _vk_id
		)
	)
   	THEN
	   INSERT INTO public.student (vk_id, subgroup_id, last_seen)
	   VALUES (_vk_id, _subgroup_id, CURRENT_DATE);
   END IF;
END;
$$;


INSERT INTO public.student (subgroup_id, last_seen)
	   VALUES (_subgroup_id, CURRENT_DATE);








UPDATE public.subgroup SET subgroup_timetable = '{"sql-is-what": "its poop"}' WHERE subgroup_id = 1