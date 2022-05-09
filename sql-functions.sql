CREATE OR REPLACE FUNCTION getTimetable(_vk_id INTEGER) RETURNS JSONB
AS
$timetable$
DECLARE
timetable JSONB;
BEGIN
	IF NOT public.studentexists(_vk_id)
		THEN RAISE EXCEPTION 'Студента с id % не существует', _vk_id;
	END IF;

	SELECT subg.subgroup_timetable INTO timetable FROM public.student as st
	JOIN public.subgroup as subg
	ON subg.subgroup_id = st.subgroup_id
	WHERE st.vk_id = _vk_id;

	UPDATE public.student as st SET last_seen = CURRENT_DATE WHERE st.vk_id = _vk_id;

	RETURN timetable;
END;
$timetable$
LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION studentExists(_vk_id INTEGER) RETURNS BOOLEAN
AS
$$
BEGIN
	RETURN EXISTS(SELECT * FROM public.student WHERE vk_id = _vk_id);
END;
$$
LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION subgroupExists(_subgroup_id INTEGER) RETURNS BOOLEAN
AS
$$
BEGIN
	RETURN EXISTS(SELECT * FROM public.subgroup WHERE subgroup_id = _subgroup_id);
END;
$$
LANGUAGE plpgsql;

RAISE EXCEPTION 'Студента с id % не существует', _vk_id;


CREATE OR REPLACE FUNCTION getFaculties() RETURNS TABLE(faculty_id INTEGER, faculty_name VARCHAR)
AS
$body$
BEGIN
	RETURN QUERY
		SELECT * FROM public.faculty;
END;
$body$
LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION getGroups(_faculty_id INTEGER) RETURNS TABLE(group_id INTEGER, group_name VARCHAR)
AS
$body$
BEGIN
	IF NOT EXISTS(SELECT * FROM public.faculty as f WHERE f.faculty_id = _faculty_id)
		THEN RAISE EXCEPTION 'Факультета с id = % не существует', _faculty_id;
	END IF;
	RETURN QUERY
		SELECT stg.group_id, stg.group_name FROM public.students_group as stg WHERE faculty_id = _faculty_id;
END;
$body$
LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION getSubgroups(_group_id INTEGER) RETURNS TABLE(group_id INTEGER, group_name VARCHAR)
AS
$body$
BEGIN
	IF NOT EXISTS(SELECT * FROM public.students_group as sg WHERE sg.group_id = _group_id)
		THEN RAISE EXCEPTION 'Группы с id = % не существует', _group_id;
	END IF;
	RETURN QUERY
		SELECT sg.subgroup_id, sg.subgroup_name FROM public.subgroup as sg WHERE sg.group_id = _group_id;
END;
$body$
LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION create_or_get_day_timetable_id(
	_group_id integer,
	_week integer,
	_day_id integer
)
RETURNS INTEGER
AS
$BODY$
DECLARE
day_id INTEGER;
BEGIN
	SELECT day_timetable_id INTO day_id FROM
		public.group_timetable as gr,
		public.group_day_connector,
		public.day_timetable as day
			WHERE
				gr.group_id = _group_id AND
				day.week_number = _week AND
				day.day_of_week_id = _day_id;
	IF NOT FOUND
	THEN
		INSERT INTO public.day_timetable
			(week_number, day_of_week_id)
			VALUES (_week, _day_id)
			RETURNING day_timetable_id INTO day_id;
		INSERT INTO public.group_day_connector
			(timetable_id, daytimetable_id)
			VALUES (
				(SELECT timetable_id FROM public.group_timetable
					WHERE group_id = _group_id),
				day_id
			);
	END IF;
	RETURN day_id;
END;
$BODY$
LANGUAGE plpgsql;