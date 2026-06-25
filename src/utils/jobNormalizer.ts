export const normalizeBackendJob = (job: any): any => {
  if (!job) return null;
 console.log('job', job)
  // location string joining
  let locationStr = '';
  if (job.locations && Array.isArray(job.locations) && job.locations.length > 0) {
    locationStr = job.locations.join(', ');
  } else if (job.location) {
    locationStr = typeof job.location === 'object' ? (job.location.location_name || '') : String(job.location);
  }

  // Map salary range
  let salaryStr = '';
  const salaryType = (job.salary_type || '').toLowerCase();
  
  const formatSalValue = (val: any) => {
    if (val === null || val === undefined || val === '') return '';
    const num = parseFloat(val);
    if (isNaN(num)) return String(val);

    if (salaryType === 'yearly') {
      return String(num);
    }
    if (num >= 100000) {
      return `${(num / 100000).toFixed(1).replace('.0', '')} Lac`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}k`;
    }
    return String(num);
  };

  if (job.salary_from && job.salary_to) {
    const fromStr = formatSalValue(job.salary_from);
    const toStr = formatSalValue(job.salary_to);
    
    if (salaryType === 'monthly') {
      salaryStr = `₹${fromStr} - ₹${toStr} / Month`;
    } else if (salaryType === 'yearly') {
      salaryStr = `₹${fromStr} - ₹${toStr} LPA`;
    } else {
      salaryStr = `₹${fromStr} - ₹${toStr}`;
    }
  } else if (job.salary_from) {
    const fromStr = formatSalValue(job.salary_from);
    if (salaryType === 'monthly') {
      salaryStr = `₹${fromStr} / Month`;
    } else if (salaryType === 'yearly') {
      salaryStr = `₹${fromStr} LPA`;
    } else {
      salaryStr = `₹${fromStr}`;
    }
  } else if (job.salary) {
    salaryStr = job.salary;
  }

  // Format type / experience
  const typeStr = job.experience || '';
  
  // Format job type (full_time, part_time, internship, contract)
  let jobTypeStr = '';
  if (job.job_type) {
    jobTypeStr = job.job_type
      .split('_')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('-');
  }

  // Work mode extraction
  let workModeStr = '';
  if (job.work_mode) {
    workModeStr = job.work_mode;
  } else if (job.workMode) {
    workModeStr = job.workMode;
  } else if (job.job_type === 'remote') {
    workModeStr = 'Remote';
  } else if (job.job_description && job.job_description.toLowerCase().includes('remote')) {
    workModeStr = 'Remote';
  } else if (job.benefits && job.benefits.toLowerCase().includes('remote')) {
    workModeStr = 'Remote';
  }

  // Split benefits string to array
  let benefitsArr: string[] = [];
  if (job.benefits) {
    benefitsArr = job.benefits.split(',').map((b: string) => b.trim()).filter((b: string) => b.length > 0);
  }

  // Map skills (could be array of objects or strings, or comma-separated string)
  let skillsArr: string[] = [];
  const rawSkills = job.skills || job.job_skills;
  if (rawSkills) {
    if (Array.isArray(rawSkills)) {
      skillsArr = rawSkills
        .map((s: any) => {
          if (typeof s === 'string') return s;
          return s.skill_name || s.name || '';
        })
        .filter((s: string) => s.length > 0);
    } else if (typeof rawSkills === 'string') {
      skillsArr = rawSkills
        .split(',')
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0);
    }
  }

  // Split education string to array if needed, or keep it as string
  const educationStr = job.education || '';

  // Get posted time diff or custom string
  let postedStr = '';
  if (job.created_at) {
    console.log('created_at', job.created_at);
    try {
      const createdDate = new Date(job.created_at);
      const diffMs = Math.max(0, Date.now() - createdDate.getTime());
      
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffMins < 1) {
        postedStr = 'Just now';
      } else if (diffMins < 60) {
        postedStr = `${diffMins} ${diffMins === 1 ? 'min' : 'mins'} ago`;
      } else if (diffHrs < 24) {
        postedStr = `${diffHrs} ${diffHrs === 1 ? 'hr' : 'hrs'} ago`;
      } else if (diffDays === 1) {
        postedStr = 'Yesterday';
      } else {
        postedStr = `${diffDays} days ago`;
      }
    } catch {
      postedStr = '';
    }
  }

  return {
    id: String(job.id),
    title: job.job_title?.job_name || job.title || '',
    company: job.company?.company_name || job.company || '',
    logo: job.company?.company_logo ? { uri: job.company.company_logo } : null,
    location: locationStr,
    salary: salaryStr,
    type: typeStr,
    job_type: jobTypeStr,
    workMode: workModeStr,
    openings: job.openings || 0,
    applicants: job.applicants_count || job.applicants || 0,
    benefits: benefitsArr,
    skills: skillsArr,
    description: job.job_description || '',
    education: educationStr,
    posted: postedStr,
    department: job.department?.department_name || (typeof job.department === 'string' ? job.department : ''),
    category: job.industry?.industry_name || job.category || '',
    responsibilities: job.responsibilities || [],
    aboutCompany: job.company?.company_about || '',
    isSaved: job.is_saved || false,
    status: job.status ? (job.status.charAt(0).toUpperCase() + job.status.slice(1)) : 'Active',
    rawJob: job // Preserve raw backend response
  };
};
