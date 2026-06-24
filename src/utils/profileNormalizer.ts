export const normalizeProfileData = (data: any) => {
  if (!data) {
    return {
      name: '',
      email: '',
      phone: '',
      role: 'company',
      companyid: '',
      created_at: '',
      manager_profile: {
        jobTitle: '',
        companyName: '',
        location: '',
        website: '',
        industry: '',
        companySize: '',
        gstNumber: '',
        foundedIn: '',
        headquarters: '',
        verificationStatus: 'Profile Incomplete',
        bio: '',
        awards: [],
        openPositions: [],
        coverImage: null,
        companyLogo: null,
        activePackageName: 'No Active Package',
        activePackageDuration: null,
        activePackageExpiry: null,
        fb_link: null,
        insta_link: null,
        linked_link: null
      },
      stats: {
        postedJobs: 0,
        totalApplicants: 0,
        shortlisted: 0,
        hired: 0
      }
    };
  }

  // Get manager profile details
  const companyObj = data.company || data;

  // Get user details
  const userObj = companyObj.user || data.user || data;
  const name = userObj.name || '';
  const email = userObj.email || '';
  const phone = userObj.phone || companyObj.w_phone || '';
  const role = userObj.role || 'company';
  const companyid = companyObj?.id || data?.company_id || data?.id || '';
  const companyName = companyObj.company_name || companyObj.companyName || '';
  const location = companyObj.office_location || companyObj.location || '';
  const industry = companyObj.industry_type || companyObj.industry || '';
  const companySize = companyObj.company_size || companyObj.companySize || '';
  const website = companyObj.company_web_url || companyObj.website || '';
  const bio = companyObj.company_about || companyObj.bio || '';
  const gstNumber = companyObj.gst_no || companyObj.gstNumber || '';
  const foundedIn = companyObj.founded_date || companyObj.foundedIn || '';
  const headquarters = companyObj.office_location || companyObj.headquarters || '';
  const jobTitle = companyObj.job_title || companyObj.jobTitle || '';
  const verificationStatus = companyObj.verificationStatus || (companyObj.company_docs ? 'Pending Verification' : 'Profile Incomplete');
  const coverImage = companyObj.cover_img || companyObj.coverImage || null;
  const companyLogo = companyObj.company_logo || companyObj.companyLogo || null;

  const fb_link = companyObj.fb_link || companyObj.fbLink || null;
  const insta_link = companyObj.insta_link || companyObj.instaLink || null;
  const linked_link = companyObj.linked_link || companyObj.linkedLink || null;

  // Map awards
  let awards = [];
  if (companyObj.awards && Array.isArray(companyObj.awards)) {
    awards = companyObj.awards.map((a: any) => ({
      title: a.award_title || a.title || '',
      date: a.award_date || a.date || a.year || '',
      description: a.desc || a.description || ''
    }));
  }

  // Map open positions
  let openPositions = [];
  if (companyObj.openPositions && Array.isArray(companyObj.openPositions)) {
    openPositions = companyObj.openPositions;
  } else if (companyObj.jobs && Array.isArray(companyObj.jobs)) {
    openPositions = companyObj.jobs.map((j: any) => ({
      id: String(j.id),
      title: j.title || '',
      location: j.location || '',
      type: j.job_type || ''
    }));
  }

  // Map active package subscription details
  const activePackageObj = companyObj.company_packages?.find((p: any) => p.status === 'active');
  const activePackageName = activePackageObj?.package?.package_name || activePackageObj?.package_name || 'No Active Package';
  const activePackageDuration = activePackageObj?.duration_in_months || activePackageObj?.package?.duration_in_months || null;
  const activePackageExpiry = activePackageObj?.expiry_date || activePackageObj?.expires_at || null;

  // Map stats
  const stats = {
    postedJobs: companyObj.jobs?.length || data.stats?.postedJobs || data.posted_jobs_count || 0,
    totalApplicants: data.stats?.totalApplicants || data.total_applicants_count || 0,
    shortlisted: data.stats?.shortlisted || data.shortlisted_count || 0,
    hired: data.stats?.hired || data.hired_count || 0
  };

  return {
    name,
    email,
    phone,
    role,
    companyid,
    created_at: companyObj.created_at || data.created_at || '',
    manager_profile: {
      jobTitle,
      companyName,
      location,
      website,
      industry,
      companySize,
      gstNumber,
      foundedIn,
      headquarters,
      verificationStatus,
      bio,
      awards,
      openPositions,
      coverImage,
      companyLogo,
      activePackageName,
      activePackageDuration,
      activePackageExpiry,
      fb_link,
      insta_link,
      linked_link
    },
    stats
  };
};
