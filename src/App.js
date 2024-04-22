import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Sidebar from 'components/Sidebar';
import Login from 'pages/Login';
import Dashboard from 'pages/Dashboard';
import JobCategory from 'pages/master/JobCategory';
import JobCategoryForm from 'pages/master/forms/JobCategoryForm';
import JobType from 'pages/master/JobType';
import JobTypeForm from 'pages/master/forms/JobTypeForm';
import EmployeeDetails from 'pages/employee/EmployeeDetails';
import EmployeeDetailsForm from 'pages/employee/forms/EmployeeDetailsForm';
import JobTitle from 'pages/master/JobTitle';
import JobTitleForm from 'pages/master/forms/JobTitleForm';
import RoleType from 'pages/master/RoleType';
import RoleTypeForm from 'pages/master/forms/RoleTypeForm';
import Zone from 'pages/employee/Zone';
import ZoneForm from 'pages/employee/forms/ZoneForm';
import BuisinessUnit from 'pages/employee/BusinessUnit';
import BuisinessUnitForm from 'pages/employee/forms/BusinessUnitForm';
import Grade from 'pages/employee/Grade';
import GradeForm from 'pages/employee/forms/GradeForm';
import Country from 'pages/master/Country';
import CountryForm from 'pages/master/forms/CountryForm';
import State from 'pages/master/State';
import StateForm from 'pages/master/forms/StateForm';
import District from 'pages/master/District';
import DistrictForm from 'pages/master/forms/DistrictForm';
import Package from 'pages/master/Package';
import PackageForm from 'pages/master/forms/PackageForm';
import PackageFeature from 'pages/master/PackageFeature';
import PackageFeatureForm from 'pages/master/forms/PackageFeatureForm';
import PackageDetail from 'pages/master/PackageDetail';
import PackageDetailForm from 'pages/master/forms/PackageDetailForm';
import Proficiency from 'pages/master/Proficiency';
import ProficiencyForm from 'pages/master/forms/ProficiencyForm';
import KeySkill from 'pages/master/KeySkill';
import KeySkillForm from 'pages/master/forms/KeySkillForm';
import CompanyType from 'pages/master/CompanyType';
import CompanyTypeForm from 'pages/master/forms/CompanyTypeForm';
import Qualification from 'pages/master/Qualification';
import QualificationForm from 'pages/master/forms/QualificationForm';
import ProgrammingLanguage from 'pages/master/ProgrammingLanguage';
import ProgrammingLanguageForm from 'pages/master/forms/ProgrammingLanguageForm';
import Proof from 'pages/master/Proof';
import ProofForm from 'pages/master/forms/ProofForm';
import Privacypolicy from "pages/staticpagecontent/PrivacyPolicy";
import Termscondition from "pages/staticpagecontent/TermsCondition";
import Disclaimer from "pages/staticpagecontent/Disclaimer";
import Aboutus from "pages/staticpagecontent/Aboutus";
import ContactSettingsForm from './pages/staticpagecontent/ContactSettingsForm';
import Home from 'pages/staticpagecontent/Home';
import FeatureCompanies from 'pages/staticpagecontent/FeatureCompanies';
import FeatureCompaniesForm from 'pages/staticpagecontent/forms/FeatureCompaniesForm';
import CustomerFeedbacks from 'pages/website/CustomerFeedbacks';
import CandidateDetails from 'pages/website/CandidateDetails';
import { EmployerDetails } from 'pages/website/EmployerDetails';
import BlogTag from 'pages/master/BlogTag';
import BlogTagForm from 'pages/master/forms/BlogTagForm';
import Blogs from 'pages/website/Blogs';
import SeoComponent from 'pages/seo/SeoComponent';
import AddSeo from 'pages/seo/AddSeo';

const App = () => {
	return (
		<BrowserRouter basename='/hirex-super-admin'>
			<Sidebar>
				<Routes>
					<Route path='/' element={<Login />} />
					<Route path='/dashboard' element={<Dashboard />} />
					{/* Job Category */}
					<Route path='/job-category' element={<JobCategory />} />
					<Route path='/job-category/add-job-category' element={<JobCategoryForm />} />
					<Route path='/job-category/:slug' element={<JobCategoryForm />} />
					{/* Job Type */}
					<Route path='/jobtype' element={<JobType />} />
					<Route path='/jobtype/add-jobtype' element={<JobTypeForm />} />
					<Route path='/jobtype/:slug' element={<JobTypeForm />} />
					{/* Job Title */}
					<Route path='/jobtitle' element={<JobTitle />} />
					<Route path='/jobtitle/add-jobtitle' element={<JobTitleForm />} />
					<Route path='/jobtitle/:slug' element={<JobTitleForm />} />
					{/* Role Type */}
					<Route path='/roletype' element={<RoleType />} />
					<Route path='/roletype/add-roletype' element={<RoleTypeForm />} />
					<Route path='/roletype/:slug' element={<RoleTypeForm />} />
					{/* Proficiency */}
					<Route path='/proficiency' element={<Proficiency />} />
					<Route path='/proficiency/add-proficiency' element={<ProficiencyForm />} />
					<Route path='/proficiency/:slug' element={<ProficiencyForm />} />
					{/* Skill */}
					<Route path='/keyskill' element={<KeySkill />} />
					<Route path='/keyskill/add-keyskill' element={<KeySkillForm />} />
					<Route path='/keyskill/:slug' element={<KeySkillForm />} />
					{/* Company type */}
					<Route path='/companytype' element={<CompanyType />} />
					<Route path='/companytype/add-companytype' element={<CompanyTypeForm />} />
					<Route path='/companytype/:slug' element={<CompanyTypeForm />} />
					{/* Qualification */}
					<Route path='/qualification' element={<Qualification />} />
					<Route path='/qualification/add-qualification' element={<QualificationForm />} />
					<Route path='/qualification/:slug' element={<QualificationForm />} />
					{/* Programming Language */}
					<Route path='/programming-language' element={<ProgrammingLanguage />} />
					<Route path='/programming-language/add-programming-language' element={<ProgrammingLanguageForm />} />
					<Route path='/programming-language/:slug' element={<ProgrammingLanguageForm />} />
					{/* Proof */}
					<Route path='/proof' element={<Proof />} />
					<Route path='/proof/add-proof' element={<ProofForm />} />
					<Route path='/proof/:slug' element={<ProofForm />} />
					{/* Blog tags */}
					<Route path='/blog-tags' element={<BlogTag />} />
					<Route path='/blog-tags/add-blog-tag' element={<BlogTagForm />} />
					<Route path='/blog-tags/:slug' element={<BlogTagForm />} />
					{/* Country */}
					<Route path='/country' element={<Country />} />
					<Route path='/country/add-country' element={<CountryForm />} />
					<Route path='/country/:slug' element={<CountryForm />} />
					{/* State */}
					<Route path='/states' element={<State />} />
					<Route path='/states/add-state' element={<StateForm />} />
					<Route path='/states/:slug' element={<StateForm />} />
					{/* District */}
					<Route path='/district' element={<District />} />
					<Route path='/district/add-district' element={<DistrictForm />} />
					<Route path='/district/:slug' element={<DistrictForm />} />
					{/* Package */}
					<Route path='/packages' element={<Package />} />
					<Route path='/packages/add-package' element={<PackageForm />} />
					<Route path='/packages/:slug' element={<PackageForm />} />
					{/* Package Feature */}
					<Route path='/package-features' element={<PackageFeature />} />
					<Route path='/package-features/add-package-feature' element={<PackageFeatureForm />} />
					<Route path='/package-features/:slug' element={<PackageFeatureForm />} />
					{/* Package Detail */}
					<Route path='/packages/package-detail-list/:slug' element={<PackageDetail />} />
					<Route path='/packages/package-detail/:slug' element={<PackageDetailForm />} />
					{/* Employee Details */}
					<Route path='/employee-details' element={<EmployeeDetails />} />
					<Route path='/employee-details/add-employee-details' element={<EmployeeDetailsForm />} />
					<Route path='/employee-details/:slug' element={<EmployeeDetailsForm />} />
					{/* Zone */}
					<Route path='/zone' element={<Zone />} />
					<Route path='/zone/add-zone' element={<ZoneForm />} />
					<Route path='/zone/:slug' element={<ZoneForm />} />
					{/* Business Unit */}
					<Route path='/business-unit' element={<BuisinessUnit />} />
					<Route path='/business-unit/add-business-unit' element={<BuisinessUnitForm />} />
					<Route path='/business-unit/:slug' element={<BuisinessUnitForm />} />
					{/* Grade */}
					<Route path='/grade' element={<Grade />} />
					<Route path='/grade/add-grade' element={<GradeForm />} />
					<Route path='/grade/:slug' element={<GradeForm />} />
					{/*static page content*/}
					<Route path="/privacy-policy" element={<Privacypolicy />} />
					<Route path="/terms-condition" element={<Termscondition />} />
					<Route path="/disclimer" element={<Disclaimer />} />
					<Route path="/about-us" element={<Aboutus />} />
					<Route path="/home" element={<Home />} />
					<Route path="/feature-companies" element={<FeatureCompanies />} />
					<Route path="/feature-companies/add-feature-company" element={<FeatureCompaniesForm />} />
					<Route path='/feature-companies/:slug' element={<FeatureCompaniesForm />} />
					<Route path='/contact-details' element={<ContactSettingsForm />} />
					{/* Website */}
					<Route path='/customer-feedbacks' element={<CustomerFeedbacks />} />
					<Route path='/employer-details' element={<EmployerDetails />} />
					<Route path='/candidate-details' element={<CandidateDetails />} />
					<Route path='/blogs' element={<Blogs />} />
					{/* Seo */}
					<Route path='/seo' element={<SeoComponent />} />
					<Route path='/seo/add-meta-data' element={<AddSeo />} />
					<Route path='/seo/:slug' element={<AddSeo />} />
				</Routes>
			</Sidebar>
		</BrowserRouter>
	)
}
export default App;