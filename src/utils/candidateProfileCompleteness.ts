export interface CandidateCompletenessResult {
  percentage: number;
  missingFields: string[];
  isComplete: boolean;
}

export const getCandidateProfileCompleteness = (user: any): CandidateCompletenessResult => {
  let parsedUser = user;
  if (typeof user === 'string') {
    try {
      parsedUser = JSON.parse(user);
    } catch {
      parsedUser = null;
    }
  }

  if (!parsedUser) {
    return { percentage: 20, missingFields: [], isComplete: false };
  }

  // Helper to safely get value from multiple possible locations/keys in user object
  const getVal = (paths: string[]): any => {
    for (const path of paths) {
      const parts = path.split('.');
      let current = parsedUser;
      for (const part of parts) {
        if (current && typeof current === 'object') {
          current = current[part];
        } else {
          current = undefined;
          break;
        }
      }
      if (current !== undefined && current !== null && current !== '') {
        // If it's an empty array, consider it missing
        if (Array.isArray(current) && current.length === 0) {
          continue;
        }
        return current;
      }
    }
    return undefined;
  };

  let percentage = 20; // 20% baseline for registration
  const missingFields: string[] = [];

  // Step 0: Personal Details (15%)
  const dob = getVal(['candidate.personal_detail.dob', 'candidate.user.dob', 'candidate.dob', 'PersonalDetails.date_of_birth', 'PersonalDetails.dateOfBirth', 'dob']);
  if (dob) percentage += 3.5; else missingFields.push('Date of Birth');

  const gender = getVal(['candidate.personal_detail.gender', 'candidate.user.gender', 'candidate.gender', 'PersonalDetails.gender', 'gender']);
  if (gender) percentage += 2.5; else missingFields.push('Gender');

  const maritalStatus = getVal(['candidate.personal_detail.marital_status', 'candidate.user.marital_status', 'candidate.maritalStatus', 'candidate.marital_status', 'PersonalDetails.status', 'PersonalDetails.maritalStatus', 'maritalStatus', 'marital_status']);
  if (maritalStatus) percentage += 2.5; else missingFields.push('Marital Status');

  const languages = getVal(['candidate.languages', 'candidate_profile.languages', 'languages']);
  if (languages && (Array.isArray(languages) ? languages.length > 0 : true)) percentage += 2.5; else missingFields.push('Languages Known');

  const city = getVal(['candidate.personal_detail.city', 'candidate.user.city', 'candidate.city', 'candidate_profile.currentLocation', 'candidate_profile.current_location', 'PersonalDetails.current_address', 'PersonalDetails.current_location', 'city']);
  if (city) percentage += 2.5; else missingFields.push('City');

  const state = getVal(['candidate.personal_detail.state', 'candidate.user.state', 'candidate.state', 'candidate_profile.state', 'state']);
  if (state) percentage += 2.5; else missingFields.push('State');

  // Step 1: Professional Info (20%)
  const summary = getVal(['candidate.professional_detail.profile_summery', 'candidate.professional_detail.profile_summary', 'candidate.professional_detail.summary', 'candidate.profile_summery', 'candidate.profile_summary', 'candidate_profile.summary', 'candidate_profile.profile_summary', 'summary', 'profile_summery', 'profile_summary']);
  if (summary) percentage += 7; else missingFields.push('Profile Summary');

  const jobTitle = getVal(['candidate.professional_detail.job_title', 'candidate.designation', 'candidate.job_title', 'candidate_profile.jobTitle', 'candidate_profile.job_title', 'jobTitle', 'job_title', 'designation']);
  if (jobTitle) percentage += 7; else missingFields.push('Job Title');

  const expLevel = getVal(['candidate.professional_detail.experience_level', 'candidate.experience_level', 'candidate_profile.experienceLevel', 'candidate_profile.experience_level', 'experienceLevel', 'experience_level']);
  if (expLevel) percentage += 6; else missingFields.push('Experience Level');

  // Step 2: Career Preferences (20%)
  const skills = getVal(['candidate.skills', 'candidate_profile.skills', 'skills']);
  if (skills && (Array.isArray(skills) ? skills.length > 0 : true)) percentage += 5; else missingFields.push('Skills');

  const jobTypes = getVal(['candidate.career_preference.preferred_job_types', 'candidate.job_types', 'candidate.job_type', 'candidate_profile.jobType', 'candidate_profile.job_types', 'jobType', 'job_types']);
  if (jobTypes && (Array.isArray(jobTypes) ? jobTypes.length > 0 : true)) percentage += 3; else missingFields.push('Preferred Job Types');

  const expectedSalary = getVal(['candidate.career_preference.expected_salary', 'candidate.expected_salary', 'candidate_profile.expectedSalary', 'candidate_profile.expected_salary', 'expectedSalary', 'expected_salary']);
  if (expectedSalary) percentage += 3; else missingFields.push('Expected Salary');

  const preferredLocation = getVal(['candidate.career_preference.preferred_location', 'candidate.preferred_location', 'candidate_profile.preferredLocation', 'candidate_profile.preferred_location', 'preferredLocation', 'preferred_location']);
  if (preferredLocation) percentage += 3; else missingFields.push('Preferred Location');

  const preferredShift = getVal(['candidate.career_preference.availability', 'candidate.preferred_shift', 'candidate_profile.preferredShift', 'candidate_profile.preferred_shift', 'preferredShift', 'preferred_shift']);
  if (preferredShift) percentage += 3; else missingFields.push('Preferred Shift');

  const noticePeriod = getVal(['candidate.career_preference.notice_period', 'candidate.notice_period', 'candidate_profile.noticePeriod', 'candidate_profile.notice_period', 'noticePeriod', 'notice_period']);
  if (noticePeriod) percentage += 3; else missingFields.push('Notice Period');

  // Step 3: Education (15%)
  const qualification = getVal(['candidate.educations.0.highest_qualification', 'candidate.qualification', 'candidate_profile.qualification', 'candidate_profile.education.0.degree', 'qualification']);
  if (qualification) percentage += 4; else missingFields.push('Highest Qualification');

  const college = getVal(['candidate.educations.0.institute_name', 'candidate.college', 'candidate_profile.college', 'candidate_profile.education.0.school', 'college']);
  if (college) percentage += 4; else missingFields.push('College Name');

  const passingYear = getVal(['candidate.educations.0.passing_year', 'candidate.passing_year', 'candidate_profile.passingYear', 'candidate_profile.education.0.endDate', 'passingYear', 'passing_year']);
  if (passingYear) percentage += 4; else missingFields.push('Passing Year');

  const graduationPercentage = getVal(['candidate.educations.0.percentage_cgpa', 'candidate.percentage', 'candidate_profile.percentage', 'candidate_profile.education.0.gpa', 'percentage']);
  if (graduationPercentage) percentage += 3; else missingFields.push('Graduation Percentage');

  // Step 4: Profile & Documents (10%)
  const resume = getVal(['candidate.docs.resume', 'candidate.resume', 'candidate_profile.resume', 'resume']);
  if (resume) percentage += 6; else missingFields.push('Resume Document');

  const profileImage = getVal(['candidate.docs.profile_img', 'candidate.profile_image', 'candidate_profile.profileImage', 'candidate_profile.profile_image', 'profileImage', 'profile_image']);
  if (profileImage) percentage += 3; else missingFields.push('Profile Photo');

  // const portfolio = getVal(['candidate.docs.portfolio_link', 'candidate.portfolio', 'candidate_profile.portfolio', 'portfolio']);
  // if (portfolio) percentage += 1;

  // Normalize final percentage
  const finalPercent = Math.min(Math.round(percentage), 100);

  return {
    percentage: finalPercent,
    missingFields,
    isComplete: finalPercent >= 100,
  };
};
