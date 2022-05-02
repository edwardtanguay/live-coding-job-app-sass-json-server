import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import db from '../data/db.json';

const jobSites = db.jobSites;

const defaultSkills = 'HTML, CSS, JavaScript, React';

export const AddJob = ({ jobsUrl }) => {
	const [formData, setFormData] = useState({});
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm({
		defaultValues: {
			skills: defaultSkills,
		},
	});

	useEffect(() => {
		const position = watch('position');
		if (position === '/r') {
			setValue('position', 'Frontend React Developer');
			setValue('skills', 'React, JavaScript, HTML, CSS');
		}
	}, [watch('position')]);

	const handleAddJobButton = async () => {
		console.log('here');
		const requestOptions = {
			method: 'POST',
			body: JSON.stringify(formData),
			headers: { 'Content-type': 'application/json; charset=UTF-8' },
		};
		try {
			await fetch(jobsUrl, requestOptions);
		} catch (e) {
			console.log(e.message);
		}
	};

	const clearForm = () => {
		setValue('position', '');
		setValue('url', '');
		setValue('skills', defaultSkills);
		setValue('bulkText', '');
	};

	useEffect(() => {
		if (Object.keys(formData).length > 0) {
			formData.status = 'send';
			handleAddJobButton();
			setFormData({});
			clearForm();
		}
	}, [formData]);

	return (
		<div className="page_addJob">
			<h3>Find Jobs:</h3>
			<ul className="jobSites">
				{jobSites.map((jobSite, index) => {
					return (
						<li key={index}>
							<a target="_blank" href={jobSite.url}>
								{jobSite.name}
							</a>
						</li>
					);
				})}
			</ul>
			<h3>Add a Job:</h3>
			<div className="App">
				<form
					onSubmit={handleSubmit((data) => {
						setFormData(data);
					})}
				>
					<div className="row">
						<input
							className="field_position"
							type="text"
							{...register('position', {
								required: 'Please enter a position.',
								minLength: {
									value: 4,
									message:
										'You need to have at least 4 characters in position name.',
								},
							})}
							placeholder="Position"
						/>
						<div className="info">{errors.position?.message}</div>
					</div>
					<div className="row">
						<input
							className="field_url"
							type="text"
							{...register('url', {
								required: 'Please enter a URL.',
							})}
							placeholder="URL"
						/>
						<div className="info">{errors.url?.message}</div>
					</div>
					<div className="row">
						<input
							className="field_skills"
							type="text"
							{...register('skills', {
								required:
									'Please enter skills in comma separated form.',
								minLength: {
									value: 4,
									message:
										'You need to have at least 4 characters in this field.',
								},
							})}
							placeholder="Skills"
						/>
						<div className="info">{errors.skills?.message}</div>
					</div>
					<div className="row">
						<textarea
							className="field_bulkText"
							{...register('bulkText', {
								required:
									'Please copy the text from the job site and paste it in here.',
							})}
							placeholder="Copy and paste text from job site here."
						/>
						<div className="info">{errors.bulkText?.message}</div>
					</div>
					<button disabled={Object.keys(errors).length}>
						Add the Job
					</button>

					{Object.keys(formData).length > 0 && (
						<div className="formData">
							<div className="info">
								This will be sent to the backend:
							</div>
							<pre>{JSON.stringify(formData, null, 2)}</pre>
						</div>
					)}
				</form>
			</div>
		</div>
	);
};
