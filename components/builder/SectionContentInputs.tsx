import Cropper from 'react-easy-crop';
import TimelineEditor from '@/components/builder/TimelineEditor';

type SectionContentInputsProps = {
	config: {
		sections?: string[];
		section_content?: Record<string, any>;
		tagline?: string;
		hero?: any;
		timeline_events?: any[];
	};
	onSectionContentChange: (sectionKey: string, content: any) => void;
	validationErrors?: Record<string, string | boolean | undefined>;
	// Hero photo props
	heroPhotoPreview?: string | null;
	crop?: { x: number; y: number };
	zoom?: number;
	setCrop?: (crop: { x: number; y: number }) => void;
	setZoom?: (zoom: number) => void;
	setCroppedAreaPixels?: (area: any) => void;
	handleHeroPhotoUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleHeroPhotoSelect?: (index: number) => void;
	handleRemoveHeroPhoto?: () => void;
	photoPreviews?: string[];
	// Gallery photo props
	handlePhotos?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
import { SECTION_CONFIG } from '../../config/sectionConfig';

import {
	TextContentInput,
	PlaylistInput,
	QuotesInput,
	FutureDreamsInput,
	VideoMemoriesInput,
	MemoryMapInput,
	SurpriseMessageInput,
	LetterToFutureInput,
	GiftSectionInput,
	ReasonsILoveYouInput,
	GuestMessagesInput,
} from './ContentInputComponents';

export default function SectionContentInputs({
	config,
	onSectionContentChange,
	validationErrors = {},
	heroPhotoPreview,
	crop,
	zoom,
	setCrop,
	setZoom,
	setCroppedAreaPixels,
	handleHeroPhotoUpload,
	handleHeroPhotoSelect,
	handleRemoveHeroPhoto,
	photoPreviews,
	handlePhotos,
}: SectionContentInputsProps) {
	const { sections = [], section_content = {} } = config || {};
	const enabledSections = Array.isArray(sections)
		? sections
				.map((key) => SECTION_CONFIG.find((s) => s.key === key))
				.filter((s): s is typeof SECTION_CONFIG[number] => Boolean(s))
		: [];

	return (
		<div>
			{enabledSections.map((section) => {
				let content = null;
				switch (section.key) {
					case 'home':
						content = (
							<div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-4">
								<span className="font-semibold text-lg">Hero Content</span>
								<label className="block text-sm font-medium text-slate-600 mb-1.5">Hero Tagline</label>
								<input
									name="tagline"
									maxLength={120}
									placeholder="Every love story is beautiful, but ours is my favorite."
									value={config.tagline || ''}
									className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all"
									onChange={e => onSectionContentChange('home', { ...section_content.home, tagline: e.target.value })}
								/>
								<p className="text-xs text-slate-400 mt-1">A short romantic line shown in the hero section. (Max 120 characters)</p>
								<label className="block text-sm font-medium text-slate-600 mb-1.5 mt-4">Dedicated Hero Cover Photo</label>
								<input
									name="hero_photo"
									type="file"
									accept="image/*"
									className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-rose-50 file:text-rose-600 hover:file:bg-rose-100 transition-all cursor-pointer"
									onChange={handleHeroPhotoUpload}
								/>
								<p className="text-xs text-slate-400 mt-1">Hero images are auto-optimized (1920px max, auto format/quality). High quality is kept for visuals.</p>
								{heroPhotoPreview && (
									<div className="mt-3 relative border border-slate-200 rounded-lg overflow-hidden" style={{ height: 240 }}>
										<Cropper
											image={heroPhotoPreview}
											crop={crop ?? { x: 0, y: 0 }}
											zoom={zoom ?? 1}
											aspect={16 / 9}
											onCropChange={setCrop ?? (() => {})}
											onZoomChange={setZoom ?? (() => {})}
											onCropComplete={(_, croppedAreaPixels) => setCroppedAreaPixels && setCroppedAreaPixels(croppedAreaPixels)}
											cropShape="rect"
											showGrid={true}
											style={{ containerStyle: { width: '100%', height: 240 } }}
										/>
										<div className="absolute top-2 right-2 flex gap-2">
											<button
												type="button"
												onClick={handleRemoveHeroPhoto}
												className="bg-black/40 text-white text-xs px-2 py-1 rounded"
											>
												Remove
											</button>
										</div>
										<div className="absolute bottom-2 left-2 right-2 flex items-center gap-2">
											<label className="text-xs text-white bg-black/40 px-2 py-1 rounded">Zoom</label>
											<input
												type="range"
												min={1}
												max={3}
												step={0.01}
												value={zoom}
												onChange={e => setZoom && setZoom(Number(e.target.value))}
												className="w-full"
											/>
										</div>
									</div>
								)}
								{photoPreviews && photoPreviews.length > 0 && (
									<div className="mt-3">
										<p className="text-xs text-slate-600 mb-2">Or select from uploaded photos</p>
										<div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
											{photoPreviews.map((preview, index) => (
												<button
													type="button"
													key={index}
													onClick={() => handleHeroPhotoSelect && handleHeroPhotoSelect(index)}
													className={`border rounded-lg overflow-hidden ${config.hero?.coverPhotoIndex === index ? 'border-rose-500 ring-2 ring-rose-200' : 'border-slate-200'}`}
												>
													<img src={preview} alt={`Hero option ${index + 1}`} className="w-full h-16 object-cover" />
												</button>
											))}
										</div>
									</div>
								)}
								{config.hero?.coverPhotoIndex !== undefined && !heroPhotoPreview && (
									<p className="text-xs text-emerald-600 mt-2">Hero cover currently set to photo {config.hero.coverPhotoIndex + 1}</p>
								)}
							</div>
						);
						break;
					case 'gallery':
						content = (
							<div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
								<span className="font-semibold text-lg">Upload Photos</span>
								<div className="mt-3">
									<label className="block text-sm font-medium text-slate-700 mb-1.5">Gallery Images</label>
									<input
										type="file"
										multiple
										className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
										onChange={handlePhotos}
									/>
									<div className="text-xs text-slate-500 mt-2">Gallery images are auto-optimized (1600px max, auto format/quality) for fast site loading.</div>
									{photoPreviews && photoPreviews.length > 0 && (
										<div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
											{photoPreviews.map((preview, index) => (
												<img key={index} src={preview} alt={`Gallery preview ${index + 1}`} className="w-full h-16 object-cover rounded" />
											))}
										</div>
									)}
									<div className="text-xs text-rose-500 mt-2 font-medium">Gallery section requires at least one photo</div>
								</div>
							</div>
						);
						break;
					case 'timeline':
						content = (
							<div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
								<span className="font-semibold text-lg">Timeline Events</span>
								<TimelineEditor
									events={config.timeline_events || []}
									onChange={timeline_events => onSectionContentChange('timeline', timeline_events)}
								/>
								{(!config.timeline_events || config.timeline_events.length === 0) && (
									<p className="text-xs text-amber-600 mt-2">
										Timeline section requires at least one event
									</p>
								)}
							</div>
						);
						break;
					case 'love_letter':
						content = (
							<TextContentInput
								label="Your Love Letter"
								value={section_content?.love_letter?.content || ''}
								onChange={(content: string) => onSectionContentChange('love_letter', { content })}
								placeholder="Write your heartfelt love letter here..."
								rows={6}
							/>
						);
						break;
					case 'playlist':
						content = (
							<PlaylistInput
								value={section_content?.playlist}
								onChange={(content: any) => onSectionContentChange('playlist', content)}
							/>
						);
						break;
					case 'quotes':
						content = (
							<QuotesInput
								value={section_content?.quotes}
								onChange={(content: any) => onSectionContentChange('quotes', content)}
							/>
						);
						break;
					case 'future_dreams':
						content = (
							<FutureDreamsInput
								value={section_content?.future_dreams}
								onChange={(content: any) => onSectionContentChange('future_dreams', content)}
							/>
						);
						break;
					case 'video_memories':
						content = (
							<VideoMemoriesInput
								value={section_content?.video_memories}
								onChange={(content: any) => onSectionContentChange('video_memories', content)}
							/>
						);
						break;
					case 'memory_map':
						content = (
							<MemoryMapInput
								value={section_content?.memory_map}
								onChange={(content: any) => onSectionContentChange('memory_map', content)}
							/>
						);
						break;
					case 'surprise_message':
						content = (
							<SurpriseMessageInput
								value={section_content?.surprise_message}
								onChange={(content: any) => onSectionContentChange('surprise_message', content)}
							/>
						);
						break;
					case 'letter_future':
						content = (
							<LetterToFutureInput
								value={section_content?.letter_future}
								onChange={(content: any) => onSectionContentChange('letter_future', content)}
							/>
						);
						break;
					case 'gift_section':
						content = (
							<GiftSectionInput
								value={section_content?.gift_section}
								onChange={(content: any) => onSectionContentChange('gift_section', content)}
							/>
						);
						break;
					case 'reasons_love_you':
						content = (
							<ReasonsILoveYouInput
								value={section_content?.reasons_love_you}
								onChange={(content: any) => onSectionContentChange('reasons_love_you', content)}
							/>
						);
						break;
					case 'guest_messages':
						content = (
							<GuestMessagesInput
								value={section_content?.guest_messages}
							/>
						);
						break;
					default:
						// Only render fallback/info for sections without custom UI
						content = (
							<span className="text-slate-400">Section key: {section.key}</span>
						);
				}
				return (
					<div key={section.key} className="mb-6">
						<div className="flex items-center gap-2 mb-2">
							<span className="text-xl">{section.icon}</span>
							<span className="font-semibold text-slate-700">{section.label}</span>
							{validationErrors && validationErrors[section.key as string] && (
								<span className="ml-2 text-xs text-rose-500">Required</span>
							)}
						</div>
						<div>{content}</div>
					</div>
				);
			})}
		</div>
	);
}
