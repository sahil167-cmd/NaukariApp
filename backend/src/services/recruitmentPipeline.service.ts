import { googleSheetsService } from './googleSheets.service';
import { emailService } from './email.service';
import { logger } from '../utils/logger';
import { config } from '../config/env.config';

const calculateAge = (dobString?: string): string => {
  if (!dobString) return '';
  let dob = new Date(dobString);
  if (isNaN(dob.getTime())) {
    // Try DD-MM-YYYY or general splits
    const parts = dobString.split('-');
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        // YYYY-MM-DD
        dob = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      } else if (parts[2].length === 4) {
        // DD-MM-YYYY
        dob = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      }
    }
  }
  if (isNaN(dob.getTime())) return dobString;
  const ageDifMs = Date.now() - dob.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970).toString();
};

const formatLanguages = (langData: any): string => {
  if (!langData) return '';
  if (typeof langData === 'string') return langData;
  if (Array.isArray(langData)) return langData.join(', ');
  if (typeof langData === 'object') {
    const activeLangs: string[] = [];
    for (const [lang, skills] of Object.entries(langData)) {
      if (skills && typeof skills === 'object') {
        const parts: string[] = [];
        if ((skills as any).read) parts.push('Read');
        if ((skills as any).write) parts.push('Write');
        if ((skills as any).speak) parts.push('Speak');
        if (parts.length > 0) {
          activeLangs.push(`${lang} (${parts.join(', ')})`);
        }
      } else if (skills === true) {
        activeLangs.push(lang);
      }
    }
    return activeLangs.join(', ');
  }
  return '';
};

export class RecruitmentPipelineService {
  public async processNewRegistration(user: any, profile: any, rawRequestBody: any = {}) {
    logger.info(`Starting recruitment pipeline process for user ${user._id}`);

    const timestamp = new Date().toISOString();
    const mongoId = user._id.toString();
    const fullName = user.name || `${profile.personal?.firstName || ''} ${profile.personal?.lastName || ''}`.trim() || 'Worker';
    const phone = profile.personal?.phone || user.phone || '';
    const gender = profile.personal?.gender || '';
    const age = calculateAge(profile.personal?.dob);
    const state = profile.address?.state || '';
    const district = profile.address?.district || '';
    const education = profile.education?.highestLevel || profile.education?.level || '';
    
    let experience = 'Fresher';
    if (Array.isArray(profile.experience) && profile.experience.length > 0) {
      const first = profile.experience[0];
      if (first.duration) {
        experience = first.duration;
        if (first.jobRole) {
          experience += ` (${first.jobRole})`;
        }
      }
    } else if (profile.experience && typeof profile.experience === 'object') {
      const expObj = profile.experience as any;
      if (expObj.hasExperience) {
        experience = `${expObj.years || 0} Years`;
        if (expObj.previousJobTitle) {
          experience += ` (${expObj.previousJobTitle})`;
        }
      }
    }

    const jobCategory = profile.jobPreferences?.categories ? profile.jobPreferences.categories.join(', ') : '';
    const expectedSalary = profile.jobPreferences?.salaryRange || '';
    
    // Check potential sources of languages
    const languages = formatLanguages(
      profile.personal?.languages || 
      rawRequestBody.personal?.languages || 
      rawRequestBody.languages || 
      rawRequestBody.education?.languages || 
      user.language || 
      ''
    );

    const shift = profile.jobPreferences?.shiftPreference || '';
    const createdAt = user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString();

    // 1. Google Sheets Appending
    try {
      const rowData = [
        timestamp,
        mongoId,
        fullName,
        phone,
        gender,
        age,
        state,
        district,
        education,
        experience,
        jobCategory,
        expectedSalary,
        languages,
        shift,
        createdAt
      ];

      logger.info(`Google Sheets Row Data for user ${mongoId}:`, { rowData });
      await googleSheetsService.appendRegistrationRow(rowData);
    } catch (sheetError: any) {
      logger.error('Recruitment Pipeline - Google Sheets error:', { error: sheetError.message });
    }

    // 2. Send Manager Email
    try {
      const emailDetails = {
        'Timestamp': timestamp,
        'Mongo ID': mongoId,
        'Full Name': fullName,
        'Phone Number': phone,
        'Gender': gender,
        'Age / DOB': `${age} (${profile.personal?.dob || 'N/A'})`,
        'State': state,
        'District': district,
        'Education Level': education,
        'Work Experience': experience,
        'Job Category': jobCategory,
        'Expected Salary': expectedSalary,
        'Languages': languages,
        'Preferred Shift': shift,
        'Registration Date': createdAt
      };

      await emailService.sendRegistrationEmail(config.MANAGER_EMAIL, emailDetails);
    } catch (emailError: any) {
      logger.error('Recruitment Pipeline - Email error:', { error: emailError.message });
    }
    
    logger.info(`Finished recruitment pipeline process for user ${user._id}`);
  }
}

export const recruitmentPipelineService = new RecruitmentPipelineService();
