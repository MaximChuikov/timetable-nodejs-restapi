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