CREATE OR REPLACE PROCEDURE createStudent(_vk_id INTEGER, _subgroup_id INTEGER)
LANGUAGE plpgsql
AS $$
BEGIN
	IF NOT public.subgroupexists(_subgroup_id)
		THEN RAISE EXCEPTION 'Подгруппа с id = % не существует', _subgroup_id;
	END IF;
	IF public.studentexists(_vk_id)
		THEN RAISE EXCEPTION 'Студент с id = % уже существует', _vk_id;
	END IF;

   	INSERT INTO public.student (vk_id, subgroup_id, last_seen)
   	VALUES (_vk_id, _subgroup_id, CURRENT_DATE);
END;
$$;


CREATE OR REPLACE PROCEDURE public.create_empty_group_timetable(
	_group_id integer)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
	IF NOT EXISTS (
		SELECT * FROM public.students_group as g
			WHERE g.group_id = _group_id
	)
	THEN RAISE EXCEPTION 'Группа с id = % не существует', _group_id;
	END IF;

	IF EXISTS (
		SELECT * FROM public.group_timetable
			WHERE group_id = _group_id
	)
	THEN
		DELETE FROM public.group_timetable CASCADE
			WHERE group_id = _group_id;
	ELSE
		INSERT INTO public.group_timetable
		(group_id) VALUES (_group_id);
	END IF;
END;
$BODY$;

CREATE OR REPLACE PROCEDURE addGeneralLessonToGroup(
	_group_id INTEGER,
	_week INTEGER,
	_day_id INTEGER,
	_pair INTEGER,
	_subject_id INTEGER,
	_cabinet_name VARCHAR(25))
LANGUAGE plpgsql
AS $$
DECLARE
new_lesson_id INTEGER;
day_id INTEGER;
BEGIN
	INSERT INTO public.lesson as l(
	pair_number, subject_id, cabinet
	)
	VALUES (_pair, _subject_id, _cabinet_name)
	RETURNING lesson_id INTO new_lesson_id;

	SELECT day_timetable_id INTO day_id FROM
				public.students_group as g,
			  	public.general_group_timetable,
		  		public.general_day_timetable
					WHERE week_number = _week AND
						  day_of_week_id = _day_id AND
						  g.group_id = _group_id;

	INSERT INTO public.general_lesson_connector
		(general_day_id, lesson_id) VALUES (day_id, new_lesson_id);
END;
$$;


CREATE OR REPLACE PROCEDURE addGeneralLessonToGroupEasy(
	_group_id INTEGER,
	_week INTEGER,
	_day_id INTEGER,
	_pair INTEGER,
	_subject_name_begin VARCHAR,
	_subject_name_end VARCHAR,
	_cabinet_name VARCHAR(25))
LANGUAGE plpgsql
AS $$
DECLARE
subject_id INTEGER;
BEGIN
	SELECT s.subject_id INTO subject_id FROM public.subject as s
		WHERE LOWER(s.subject_name) LIKE LOWER(_subject_name_begin || '%') AND
			  LOWER(s.subject_name) LIKE LOWER('%' || _subject_name_end);

	CALL addGeneralLessonToGroup(
		_group_id,
		_week,
		_day_id,
		_pair,
		subject_id,
		_cabinet_name
	);
END;
$$;

CREATE OR REPLACE PROCEDURE addSubject(_subj_name VARCHAR, _lecturer_id INTEGER)
LANGUAGE plpgsql
AS
$$
BEGIN
	INSERT INTO public.subject (subject_name, lecturer_id) VALUES (_subj_name, _lecturer_id);
END;
$$

CREATE OR REPLACE PROCEDURE addSubjectEasy(_subj_name VARCHAR, _lecturer_name VARCHAR)
LANGUAGE plpgsql
AS
$$
DECLARE
find_lecturer_id INTEGER;
BEGIN
	SELECT lecturer_id INTO find_lecturer_id FROM public.lecturer
		WHERE lecturer_name LIKE _lecturer_name || '%';
	CALL public.addsubject(_subj_name, find_lecturer_id);
END;
$$


//баги
CREATE OR REPLACE PROCEDURE add_individual_Lesson_To_subGroup(
	_subgroup_id INTEGER,
	_week INTEGER,
	_day_id INTEGER,
	_pair INTEGER,
	_subject_id INTEGER,
	_cabinet_name VARCHAR(25))
LANGUAGE plpgsql
AS $$
DECLARE
new_lesson_id INTEGER;
day_id INTEGER;
BEGIN
	INSERT INTO public.lesson as l(
	pair_number, subject_id, cabinet
	)
	VALUES (_pair, _subject_id, _cabinet_name)
	RETURNING lesson_id INTO new_lesson_id;

	SELECT individual_timetable_id INTO day_id FROM
				public.subgroup as s,
			  	public.individual_subgroup_timetable as t,
		  		public.individual_day_timetable as d
					WHERE d.week_number = _week AND
						  d.day_of_week_id = _day_id AND
						  s.subgroup_id = _subgroup_id;

	INSERT INTO public.individual_lesson_connector
		(individual_day_id, lesson_id) VALUES (day_id, new_lesson_id);
END;
$$;


CREATE OR REPLACE PROCEDURE add_individual_Lesson_To_subGroup_Easy(
	_subgroup_id INTEGER,
	_week INTEGER,
	_day_id INTEGER,
	_pair INTEGER,
	_subject_name_begin VARCHAR,
	_subject_name_end VARCHAR,
	_cabinet_name VARCHAR(25))
LANGUAGE plpgsql
AS $$
DECLARE
subject_id INTEGER;
BEGIN
	SELECT s.subject_id INTO subject_id FROM public.subject as s
		WHERE LOWER(s.subject_name) LIKE LOWER(_subject_name_begin || '%') AND
			  LOWER(s.subject_name) LIKE LOWER('%' || _subject_name_end);
	CALL add_individual_Lesson_To_subGroup(
		_subgroup_id,
		_week,
		_day_id,
		_pair,
		subject_id,
		_cabinet_name
	);
END;
$$;

CREATE OR REPLACE PROCEDURE add_or_replace_group_lesson(
	_group_id integer,
	_week integer,
	_day_id integer,
	_pair integer,
	_subject_id integer,
	_cabinet_name character varying)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
new_lesson_id INTEGER;
day_id INTEGER;
BEGIN
-- 	Обновляем или создаем новую строку в таблице lesson
	SELECT lesson.lesson_id INTO new_lesson_id FROM
		public.group_timetable as gr,
		public.group_day_connector,
		public.day_timetable as day,
		public.lesson as lesson
			WHERE
				gr.group_id = _group_id AND
				day.week_number = _week AND
				day.day_of_week_id = _day_id AND
				lesson.pair_number = _pair;
	IF FOUND
	THEN
		UPDATE public.lesson
			SET general_day_id = day_id,
				lesson_id = new_lesson_id
			WHERE lesson_id = new_lesson_id;
	ELSE
-- 		Нужно добавить новый lesson в существующий день, либо создать новый
		INSERT INTO public.lesson
		(pair_number, subject_id, cabinet, day_timetable_id)
		VALUES (_pair, _subject_id, _cabinet_name, (
						SELECT * FROM public.create_or_get_group_day_timetable_id(
								_group_id, _week, _day_id
							)
						)
	   	);
	END IF;
END;
$BODY$;



