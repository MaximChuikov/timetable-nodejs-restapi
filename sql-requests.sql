CREATE TABLE lecturer(
    lecturer_id SERIAL PRIMARY KEY,
    lecturer_name VARCHAR(30) NOT NULL,
	faculty_id INTEGER,
    FOREIGN KEY (faculty_id) REFERENCES public.faculty (faculty_id)
)
CREATE TABLE days_of_week(
	day_id INTEGER PRIMARY KEY,
	day_name VARCHAR(20) NOT NULL
)

CREATE TABLE student(
    vk_id Integer PRIMARY KEY,
    group_id Integer
    FOREIGN KEY (group_id) REFERENCES group (group_id),
    subgroup_id Integer,
    FOREIGN KEY (subgroup_id) REFERENCES subgroup (subgroup_id)
)
CREATE TABLE subject(
	subject_id SERIAL PRIMARY KEY,
	subject_name VARCHAR(60) NOT NULL,
	lecturer_id INTEGER,
	FOREIGN KEY (lecturer_id) REFERENCES public.lecturer (lecturer_id)
)
CREATE TABLE lesson(
	lesson_id SERIAL PRIMARY KEY,
	pair_number Integer NOT NULL,
    FOREIGN KEY (pair_number) REFERENCES public.bells (pair_number),
	subject_id INTEGER NOT NULL,
	FOREIGN KEY (subject_id) REFERENCES public.subject (subject_id),
	lecturer_id INTEGER,
	FOREIGN KEY (lecturer_id) REFERENCES public.lecturer (lecturer_id)

	еще
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
CREATE TABLE day_timetable(
	day_timetable_id SERIAL PRIMARY KEY,
	week_number INTEGER NOT NULL,
	day_of_week_id INTEGER NOT NULL,
	FOREIGN KEY (day_of_week_id)
		REFERENCES public.days_of_week (day_id)
)
CREATE TABLE group_timetable(
	timetable_id SERIAL PRIMARY KEY,
	group_id INTEGER NOT NULL,
	FOREIGN KEY (group_id)
		REFERENCES public.students_group (group_id)
)

CREATE TABLE subgroup_timetable(
	timetable_id SERIAL PRIMARY KEY,
	subgroup_id INTEGER NOT NULL,
	FOREIGN KEY (subgroup_id)
		REFERENCES public.subgroup (subgroup_id)
)

CREATE TABLE group_day_connector(
	connect_id SERIAL PRIMARY KEY,
	timetable_id INTEGER NOT NULL,
	FOREIGN KEY (timetable_id)
		REFERENCES public.group_timetable (timetable_id),
	daytimetable_id INTEGER NOT NULL,
	FOREIGN KEY (daytimetable_id)
		REFERENCES public.day_timetable (day_timetable_id)
)
CREATE TABLE subgroup_day_connector(
	connect_id SERIAL PRIMARY KEY,
	timetable_id INTEGER NOT NULL,
	FOREIGN KEY (timetable_id)
		REFERENCES public.subgroup_timetable (timetable_id),
	daytimetable_id INTEGER NOT NULL,
	FOREIGN KEY (daytimetable_id)
		REFERENCES public.day_timetable (day_timetable_id)
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