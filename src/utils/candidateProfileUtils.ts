export const parseDOB = (dobStr: string): Date | null => {
  if (!dobStr) return null;
  const parts = dobStr.split('-');
  if (parts.length === 3) {
    let day, month, year;
    if (parts[0].length === 4) {
      // YYYY-MM-DD
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1;
      day = parseInt(parts[2], 10);
    } else {
      // DD-MM-YYYY
      day = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1;
      year = parseInt(parts[2], 10);
    }
    const date = new Date(year, month, day);
    if (!isNaN(date.getTime())) return date;
  }
  return null;
};

export const formatDOB = (date: Date): string => {
  if (!date) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const parseYear = (yearStr: string): Date | null => {
  if (!yearStr) return null;
  const year = parseInt(yearStr, 10);
  if (!isNaN(year)) {
    return new Date(year, 0, 1);
  }
  return null;
};

export const formatYear = (date: Date | null): string => {
  if (!date) return '';
  return String(date.getFullYear());
};

export const normalizeCandidateProfile = (user: any) => {
  const candObj = user?.candidate || user || {};

  // Normalize professional details
  const profDetail = candObj.professional_detail || {};
  const careerPref = candObj.career_preference || {};
  const personalDetail = candObj.personal_detail || user?.PersonalDetails || {};
  const educationsList = candObj.educations || candObj.education || [];
  const docsObj = candObj.docs || {};
  const rawSkills = candObj.skills || [];
  const rawLanguages = candObj.languages || [];

  // Convert educations array structure
  const normalizedEducation = educationsList.map((edu: any) => ({
    degree: edu.highest_qualification || edu.degree || '',
    school: edu.institute_name || edu.school || '',
    startDate: edu.passing_year || edu.startDate || '',
    endDate: edu.passing_year || edu.endDate || '',
    gpa: edu.percentage_cgpa || edu.gpa || '',
    location: edu.location || '',
  }));

  // Convert skills array (handles array of strings or array of skill objects)
  const normalizedSkills = rawSkills.map((s: any) => typeof s === 'string' ? s : s.skill);

  // Convert languages array (handles array of strings or array of language objects)
  const normalizedLanguages = rawLanguages.map((l: any) => {
    if (typeof l === 'string') return l;
    if (l.language_name) {
      let text = `${l.language_name} (${l.proficiency || ''})`;
      if (l.comfortable_in) {
         const comfortStr = Array.isArray(l.comfortable_in) ? l.comfortable_in.join(', ') : l.comfortable_in;
         text += ` • ${comfortStr}`;
      }
      return text;
    }
    return l.name || l.language || '';
  });

  const normalizedProfile = {
    // Basic / Professional
    jobTitle: profDetail.job_title || candObj.designation || candObj.jobTitle || '',
    currentCompany: profDetail.current_company || candObj.currentCompany || '',
    totalExperience: (profDetail.exp_years != null && profDetail.exp_years !== 'null') ? `${profDetail.exp_years} Years ${(profDetail.exp_months != null && profDetail.exp_months !== 'null') ? profDetail.exp_months : 0} Months` : (candObj.totalExperience || null),
    currentCTC: (profDetail.ctc != null && profDetail.ctc !== 'null') ? `${profDetail.ctc}` : (candObj.currentCTC || ''),
    currentLocation: (profDetail.current_location !== 'null' ? profDetail.current_location : null) || (candObj.currentLocation !== 'null' ? candObj.currentLocation : null) || (candObj.current_location !== 'null' ? candObj.current_location : null) || '',
    noticePeriod: careerPref.notice_period || candObj.noticePeriod || '',
    city: profDetail.city || candObj.city || '',
    state: profDetail.state || candObj.state || '',
    // Summary
    summary: profDetail.profile_summery || candObj.profile_summery || candObj.profile_summary || candObj.summary || '',

    // Career Preferences
    preferredLocation: careerPref.preferred_location || candObj.preferredLocation || candObj.preferred_location || '',
    jobType: Array.isArray(careerPref.preferred_job_types)
      ? careerPref.preferred_job_types.join(', ')
      : (typeof careerPref.preferred_job_types === 'string' ? careerPref.preferred_job_types : (candObj.jobType || '')),
    preferredShift: careerPref.availability || candObj.preferredShift || '',
    expectedCTC: careerPref.expected_salary !== undefined ? `${careerPref.expected_salary} LPA` : (candObj.expectedCTC || candObj.expectedSalary || ''),

    // Skills & Languages & Education
    skills: normalizedSkills,
    languages: normalizedLanguages,
    education: normalizedEducation,
    experiences: candObj.experiences || [], // fallback to empty
    resume: docsObj.resume || candObj.resume || '',
    profile_image: docsObj.profile_img || candObj.profile_image || candObj.profileImage || '',
    portfolio: docsObj.portfolio_link || candObj.portfolio || '',
  };

  const normalizedPersonalDetails = {
    gender: personalDetail.gender || '',
    date_of_birth: personalDetail.dob || personalDetail.date_of_birth || '',
    current_address: personalDetail.city || personalDetail.current_address || '',
    status: personalDetail.marital_status || personalDetail.status || '',
  };

  return { normalizedProfile, normalizedPersonalDetails };
};

export const buildProfilePayload = (activeSection: string, editData: any, cand: any) => {
  let payload: any = {
    candidate_id: cand.id,
  };

  if (activeSection === 'profile') {
    payload = {
      ...payload,
      job_title: editData.job_title,
      current_location: editData.current_location,
    };
  } else if (activeSection === 'professional') {
    payload = {
      ...payload,
      job_title: editData.job_title,
      experience_level: editData.experience_level,
      exp_years: editData.exp_years,
      exp_months: editData.exp_months,
      current_company: editData.current_company,
      current_location: editData.current_location,
      ctc: editData.ctc,
    };
  } else if (activeSection === 'skills') {
    payload = { ...payload, skills: editData.skills };
  } else if (activeSection === 'experience') {
    payload = { ...payload, experiences: editData.experiences };
  } else if (activeSection === 'summary') {
    payload = { ...payload, profile_summery: editData.profile_summery };
  } else if (activeSection === 'career') {
    payload = {
      ...payload,
      preferred_location: editData.preferred_location,
      expected_salary: editData.expected_salary,
      availability: editData.availability,
      preferred_job_types: editData.preferred_job_types,
      notice_period: editData.notice_period,
    };
  } else if (activeSection === 'education') {
    payload = {
      ...payload,
      highest_qualification: editData.highest_qualification,
      institute_name: editData.institute_name,
      passing_year: editData.passing_year ? formatYear(editData.passing_year) : '',
      percentage_cgpa: editData.percentage_cgpa,
    };
  } else if (activeSection === 'personal') {
    payload = {
      ...payload,
      dob: editData.dob ? formatDOB(editData.dob) : '',
      gender: editData.gender,
      marital_status: editData.marital_status,
      city: editData.city,
      state: editData.state,
    };
  } else if (activeSection === 'languages') {
    const mapComfortSkill = (skill: string) => {
      const s = skill.trim();
      if (s === 'Reading') return 'Read';
      if (s === 'Writing') return 'Write';
      if (s === 'Speaking') return 'Speak';
      return s;
    };

    const uniqueLangs = new Map();
    (editData.languages || []).forEach((lang: any) => {
      const langName = lang.language_name || lang.language;
      if (!uniqueLangs.has(langName)) {
        uniqueLangs.set(langName, lang);
      }
    });

    payload = {
      ...payload,
      languages: Array.from(uniqueLangs.values()).map((lang: any) => ({
        language_name: lang.language_name || lang.language,
        proficiency: lang.proficiency,
        comfortable_in: (Array.isArray(lang.comfortable_in)
          ? lang.comfortable_in
          : String(lang.comfortable_in).split(',')).map(mapComfortSkill).join(', '),
      })),
    };
  } else if (activeSection === 'documents') {
    const data = new FormData();
    data.append('candidate_id', String(cand.id || ''));
    data.append('portfolio_link', editData.portfolio || '');
    if (editData.profileImage) {
      if (!editData.profileImage.uri.startsWith('http')) {
        data.append('profile_img', {
          uri: editData.profileImage.uri,
          name: editData.profileImage.name || 'profile.jpg',
          type: editData.profileImage.type || 'image/jpeg',
        } as any);
      }
    }
    if (editData.resume) {
      if (!editData.resume.uri.startsWith('http')) {
        data.append('resume', {
          uri: editData.resume.uri,
          name: editData.resume.name || 'resume.pdf',
          type: editData.resume.type || 'application/pdf',
        } as any);
      }
    }
    payload = data;
  }

  return payload;
};
