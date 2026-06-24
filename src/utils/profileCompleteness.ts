/**
 * Helper utility to calculate the completion percentage and find missing fields
 * for a manager's company profile.
 * Supporting both raw API responses (snake_case) and normalized front-end models (camelCase).
 */
export interface CompletenessResult {
  percentage: number;
  missingFields: string[];
  isComplete: boolean;
}

export const getProfileCompleteness = (company: any): CompletenessResult => {
  if (!company) {
    return {
      percentage: 0,
      missingFields: [
        'Company Name',
        'About Company',
        'Office Location',
        'Industry Type',
        'Company Size',
        'Company Website',
        'Company Logo',
        'Cover Image',
        'GST / Verification Document'
      ],
      isComplete: false,
    };
  }

  // If a full user object was passed, extract the nested company property
  const companyObj = company.company || company;

  // Extract fields supporting both raw and normalized keys
  const companyName = companyObj.company_name || companyObj.companyName || '';
  const bio = companyObj.company_about || companyObj.bio || '';
  const location = companyObj.office_location || companyObj.location || companyObj.headquarters || '';
  const industry = companyObj.industry_type || companyObj.industry || '';
  const companySize = companyObj.company_size || companyObj.companySize || '';
  const website = companyObj.company_web_url || companyObj.website || '';
  const companyLogo = companyObj.company_logo || companyObj.companyLogo || null;
  const coverImage = companyObj.cover_img || companyObj.coverImage || null;
  const gstNo = companyObj.gst_no || companyObj.gstNumber || '';
  const companyDocs = companyObj.company_docs || companyObj.companyDocs || companyObj.verifDoc || null;

  // Base completion of 20% for successfully registering / logging in
  let percentage = 20;
  const missingFields: string[] = [];

  // 1. Company Name (10%)
  if (companyName && String(companyName).trim() !== '') {
    percentage += 10;
  } else {
    missingFields.push('Company Name');
  }

  // 2. About Company / Bio (10%)
  if (bio && String(bio).trim() !== '') {
    percentage += 10;
  } else {
    missingFields.push('About Company');
  }

  // 3. Office Location (10%)
  if (location && String(location).trim() !== '') {
    percentage += 10;
  } else {
    missingFields.push('Office Location');
  }

  // 4. Industry Type (10%)
  if (industry && String(industry).trim() !== '') {
    percentage += 10;
  } else {
    missingFields.push('Industry Type');
  }

  // 5. Company Size (10%)
  if (companySize && String(companySize).trim() !== '') {
    percentage += 10;
  } else {
    missingFields.push('Company Size');
  }

  // 6. Company Website (10%)
  if (website && String(website).trim() !== '') {
    percentage += 10;
  } else {
    missingFields.push('Company Website');
  }

  // 7. Company Logo (10%)
  if (companyLogo && (typeof companyLogo === 'string' ? companyLogo.trim() !== '' : (companyLogo.uri && companyLogo.uri.trim() !== ''))) {
    percentage += 10;
  } else {
    missingFields.push('Company Logo');
  }

  // 8. Cover Image (5%)
  if (coverImage && (typeof coverImage === 'string' ? coverImage.trim() !== '' : (coverImage.uri && coverImage.uri.trim() !== ''))) {
    percentage += 5;
  } else {
    missingFields.push('Cover Image');
  }

  // 9. GST Number & Verification Document (5%)
  // Either GST Number or Document uploaded makes the profile verified/completed
  const hasGst = gstNo && String(gstNo).trim() !== '';
  const hasDocs = companyDocs && (typeof companyDocs === 'string' ? companyDocs.trim() !== '' : (companyDocs.uri && companyDocs.uri.trim() !== ''));
  if (hasGst || hasDocs) {
    percentage += 5;
  } else {
    missingFields.push('Verification (GST or Doc)');
  }

  return {
    percentage: Math.min(percentage, 100),
    missingFields,
    isComplete: percentage >= 100,
  };
};
