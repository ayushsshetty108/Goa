import { useMemo, useState } from 'react';
import { ArrowLeft, Check, Compass, Eye, EyeOff, Image, LayoutDashboard, LogOut, Map, Plus, Save, Settings2, Trash2, X } from 'lucide-react';
import { defaultSiteContent } from '../data/goa';

const loginName = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
const loginPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'goa123';
const sections = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'hero', label: 'Homepage hero', icon: Image },
  { id: 'destinations', label: 'Destinations', icon: Map },
  { id: 'deals', label: 'Deals & activities', icon: Compass },
  { id: 'guide', label: 'Goa guide', icon: Eye },
  { id: 'siteText', label: 'Profile & footer', icon: Settings2 },
];

function Field({ label, value, onChange, placeholder = '', multiline = false }) {
  const Input = multiline ? 'textarea' : 'input';
  return <label className="admin-field"><span>{label}</span><Input value={value ?? ''} onChange={event => onChange(event.target.value)} placeholder={placeholder} rows={multiline ? 3 : undefined} /></label>;
}

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const submit = event => {
    event.preventDefault();
    if (username.trim() !== loginName || password !== loginPassword) {
      setError('That username or password does not match.');
      return;
    }
    onLogin();
  };

  return <div className="admin-login-wrap"><form className="admin-login" onSubmit={submit}>
    <div className="admin-logo"><span><Compass size={22} /></span><div><b>Tide Admin</b><small>Website content studio</small></div></div>
    <div className="admin-eyebrow">PRIVATE WORKSPACE</div><h1>Welcome back.</h1><p>Sign in to update the Goa planner website.</p>
    <Field label="Username" value={username} onChange={setUsername} placeholder="Enter admin username" />
    <label className="admin-field"><span>Password</span><div className="admin-password"><input type={visible ? 'text' : 'password'} value={password} onChange={event => setPassword(event.target.value)} placeholder="Enter admin password" /><button type="button" onClick={() => setVisible(show => !show)} aria-label={visible ? 'Hide password' : 'Show password'}>{visible ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></label>
    {error && <p className="admin-error">{error}</p>}<button className="admin-primary admin-login-button">Sign in to dashboard <ArrowLeft size={16} className="admin-login-arrow" /></button>
    <div className="admin-demo-credentials"><b>Demo sign in</b><span>Username: <code>{loginName}</code></span><span>Password: <code>{loginPassword}</code></span><small>Set VITE_ADMIN_USERNAME and VITE_ADMIN_PASSWORD in your local .env to change these demo values. This client-side login is for local preview only.</small></div>
  </form></div>;
}

function Overview({ content, onSelect }) {
  const rows = [
    ['Destination cards', content.destinations.length, 'Manage names, details and photos', 'destinations'],
    ['Deal cards', content.deals.length, 'Manage travel offers and activities', 'deals'],
    ['Guide regions', content.guide.length, 'Manage North and South Goa content', 'guide'],
  ];
  return <>
    <div className="admin-welcome"><div><span className="admin-eyebrow">TIDE WEBSITE · CONTENT</span><h1>Good day, admin.</h1><p>Everything you update here is saved in this browser and used on the public website.</p></div><div className="admin-date-card"><span>YOUR WORKSPACE</span><b>Goa trip planner</b><small>Local demo · Changes stored on this device</small></div></div>
    <div className="admin-stats">{rows.map(([label, count, hint, target]) => <button className="admin-stat" key={label} onClick={() => onSelect(target)}><span>{label}</span><b>{count}</b><small>{hint}</small></button>)}</div>
    <div className="admin-panel overview-panel"><div className="admin-panel-heading"><div><span className="admin-eyebrow">QUICK ACCESS</span><h2>Choose what to update</h2></div></div><div className="admin-quick-grid">{sections.slice(1).map(({ id, label, icon: Icon }) => <button key={id} onClick={() => onSelect(id)}><span><Icon size={18} /></span><b>{label}</b><small>Open editor <ArrowLeft size={12} className="quick-arrow" /></small></button>)}</div></div>
  </>;
}

function HeroEditor({ content, setContent }) {
  const update = (key, value) => setContent(current => ({ ...current, hero: { ...current.hero, [key]: value } }));
  return <div className="admin-editor-grid"><div className="admin-panel"><div className="admin-panel-heading"><div><span className="admin-eyebrow">HOMEPAGE</span><h2>Hero section</h2><p>Set the first message and background image visitors see.</p></div></div><div className="admin-fields">
    <Field label="Small label" value={content.hero.tag} onChange={value => update('tag', value)} /><Field label="Headline · use | to split lines" value={content.hero.title} onChange={value => update('title', value)} /><Field label="Description" multiline value={content.hero.description} onChange={value => update('description', value)} /><Field label="Background image URL" value={content.hero.image} onChange={value => update('image', value)} placeholder="https://…" />
  </div></div><div className="admin-preview-card"><span className="admin-eyebrow">IMAGE PREVIEW</span>{content.hero.image ? <img src={content.hero.image} alt="Hero preview" /> : <div className="admin-image-placeholder"><Image size={24} /><span>Paste an image URL to preview it</span></div>}<small>Use a public image URL. Image uploads are not enabled in this local demo.</small></div></div>;
}

function CollectionEditor({ title, eyebrow, description, collection, records, createRecord, fields, updateRecord, deleteRecord, addRecord, imageKey = 'image' }) {
  return <div className="admin-collection-view"><div className="admin-page-heading"><div><span className="admin-eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div><button className="admin-primary" onClick={addRecord}><Plus size={16} /> Add new</button></div>
    <div className="admin-record-list">{records.map((record, index) => <article className="admin-record" key={record.id ?? `${collection}-${index}`}>
      <div className="admin-record-top"><div className="admin-record-number">{String(index + 1).padStart(2, '0')}</div><div className="admin-record-heading"><b>{record.name || record.title || record.region || record.label || `${title} ${index + 1}`}</b><span>{record.type || record.area || record.region || record.label || 'Content card'}</span></div><button className="admin-delete" onClick={() => deleteRecord(collection, index)} aria-label={`Delete ${record.name || record.title || 'item'}`}><Trash2 size={16} /></button></div>
      {record[imageKey] && <img className="admin-record-image" src={record[imageKey]} alt="" />}
      <div className="admin-record-fields">{fields.map(field => <Field key={field.key} label={field.label} value={record[field.key]} multiline={field.multiline} placeholder={field.placeholder} onChange={value => updateRecord(collection, index, field.key, value)} />)}</div>
    </article>)}</div>
    {records.length === 0 && <div className="admin-empty"><Image size={22} /><b>No {title.toLowerCase()} yet</b><span>Add your first card to show it on the website.</span><button className="admin-primary" onClick={() => addRecord(collection)}>Add new</button></div>}
  </div>;
}

function GuideEditor({ content, setContent }) {
  const update = (key, value) => setContent(current => ({ ...current, [key]: value }));
  const updateBanner = (key, value) => setContent(current => ({ ...current, banner: { ...current.banner, [key]: value } }));
  const updateTip = (key, value) => setContent(current => ({ ...current, tip: { ...current.tip, [key]: value } }));
  const updateGuide = (index, key, value) => setContent(current => ({ ...current, guide: current.guide.map((record, i) => i === index ? { ...record, [key]: value } : record) }));
  const addGuide = () => update('guide', [...content.guide, { region: 'NEW REGION', number: '09 — 12', title: 'A new way|to explore.', description: '', tags: '', tone: 'north' }]);
  return <div className="admin-collection-view"><div className="admin-page-heading"><div><span className="admin-eyebrow">EDITORIAL CONTENT</span><h1>Goa guide</h1><p>Manage the banner, regional guide cards and local tip.</p></div></div>
    <div className="admin-panel admin-standalone-panel"><div className="admin-panel-heading"><div><span className="admin-eyebrow">GUIDE BANNER</span><h2>Wide image section</h2></div></div><div className="admin-fields"><Field label="Small label" value={content.banner.tag} onChange={value => updateBanner('tag', value)} /><Field label="Headline · use | to split lines" value={content.banner.title} onChange={value => updateBanner('title', value)} /><Field label="Description" multiline value={content.banner.text} onChange={value => updateBanner('text', value)} /><Field label="Background image URL" value={content.banner.image} onChange={value => updateBanner('image', value)} /></div></div>
    <div className="admin-page-heading admin-subheading"><div><span className="admin-eyebrow">REGIONS</span><h2>Guide cards</h2></div><button className="admin-secondary" onClick={addGuide}><Plus size={15} /> Add region</button></div>
    <div className="admin-record-list">{content.guide.map((record, index) => <article className="admin-record" key={`${record.region}-${index}`}><div className="admin-record-top"><div className="admin-record-number">{String(index + 1).padStart(2, '0')}</div><div className="admin-record-heading"><b>{record.region}</b><span>Guide card</span></div><button className="admin-delete" onClick={() => update('guide', content.guide.filter((_, i) => i !== index))} aria-label={`Delete ${record.region}`}><Trash2 size={16} /></button></div><div className="admin-record-fields">{[
      ['region', 'Region name'], ['number', 'Card number'], ['title', 'Headline · use | to split lines'], ['description', 'Description', true], ['tags', 'Places · comma separated'],
    ].map(([key, label, multiline]) => <Field key={key} label={label} value={record[key]} multiline={multiline} onChange={value => updateGuide(index, key, value)} />)}<label className="admin-field"><span>Card color</span><select value={record.tone} onChange={event => updateGuide(index, 'tone', event.target.value)}><option value="north">Sea blue</option><option value="south">Warm sand</option></select></label></div></article>)}</div>
    <div className="admin-panel admin-standalone-panel"><div className="admin-panel-heading"><div><span className="admin-eyebrow">LOCAL TIP</span><h2>Closing note</h2></div></div><div className="admin-fields"><Field label="Eyebrow" value={content.tip.eyebrow} onChange={value => updateTip('eyebrow', value)} /><Field label="Headline · use | to split lines" value={content.tip.title} onChange={value => updateTip('title', value)} /><Field label="Description" multiline value={content.tip.description} onChange={value => updateTip('description', value)} /></div></div>
  </div>;
}

function SiteTextEditor({ content, setContent }) {
  const update = (section, key, value) => setContent(current => ({ ...current, [section]: { ...current[section], [key]: value } }));
  const updateCopy = (section, key, value) => setContent(current => ({ ...current, copy: { ...current.copy, [section]: { ...current.copy[section], [key]: value } } }));
  const updateUi = (key, value) => setContent(current => ({ ...current, ui: { ...current.ui, [key]: value } }));
  const updateNav = (key, value) => setContent(current => ({ ...current, ui: { ...current.ui, navigation: { ...current.ui.navigation, [key]: value } } }));
  return <div className="admin-collection-view"><div className="admin-page-heading"><div><span className="admin-eyebrow">OTHER PAGE CONTENT</span><h1>Profile & footer</h1><p>Update the profile card and the closing footer information.</p></div></div>
    <div className="admin-panel admin-standalone-panel"><div className="admin-panel-heading"><div><span className="admin-eyebrow">SITE NAVIGATION & ACTIONS</span><h2>Button and menu labels</h2></div></div><div className="admin-record-fields">{Object.entries(content.ui.navigation).map(([key, value]) => <Field key={key} label={`Navigation · ${key}`} value={value} onChange={next => updateNav(key, next)} />)}<Field label="Hero plan button" value={content.ui.heroPlan} onChange={value => updateUi('heroPlan', value)} /><Field label="Hero explore button" value={content.ui.heroExplore} onChange={value => updateUi('heroExplore', value)} /><Field label="Guide banner button" value={content.ui.bannerAction} onChange={value => updateUi('bannerAction', value)} /><Field label="Profile button" value={content.ui.profileAction} onChange={value => updateUi('profileAction', value)} /></div></div>
    <div className="admin-panel admin-standalone-panel"><div className="admin-panel-heading"><div><span className="admin-eyebrow">PAGE COPY</span><h2>Section headings and introductions</h2><p>Update the heading and introductory copy for each public page section.</p></div></div><div className="admin-record-list">{Object.entries(content.copy).map(([section, values]) => <div className="admin-copy-block" key={section}><b>{section[0].toUpperCase() + section.slice(1)} section</b><div className="admin-record-fields"><Field label="Eyebrow" value={values.eyebrow} onChange={value => updateCopy(section, 'eyebrow', value)} /><Field label="Title" value={values.title} onChange={value => updateCopy(section, 'title', value)} /><Field label="Description" multiline value={values.text} onChange={value => updateCopy(section, 'text', value)} />{values.action !== undefined && <Field label="Action label" value={values.action} onChange={value => updateCopy(section, 'action', value)} />}{values.prompts !== undefined && <Field label="Suggested prompts · separate with |" multiline value={values.prompts} onChange={value => updateCopy(section, 'prompts', value)} />}</div></div>)}</div></div>
    <div className="admin-panel admin-standalone-panel"><div className="admin-panel-heading"><div><span className="admin-eyebrow">TRAVEL PROFILE</span><h2>Profile card details</h2></div></div><div className="admin-fields"><Field label="Profile headline" value={content.profile.title} onChange={value => update('profile', 'title', value)} /><Field label="Profile description" multiline value={content.profile.description} onChange={value => update('profile', 'description', value)} /><Field label="Favorite travel preference" value={content.profile.preference} onChange={value => update('profile', 'preference', value)} /><Field label="Default budget label" value={content.profile.budget} onChange={value => update('profile', 'budget', value)} /></div></div>
    <div className="admin-panel admin-standalone-panel"><div className="admin-panel-heading"><div><span className="admin-eyebrow">FOOTER</span><h2>Footer details</h2></div></div><div className="admin-fields"><Field label="Closing saying · use | to split lines" value={content.footer.saying} onChange={value => update('footer', 'saying', value)} /><Field label="Coordinates · use | to split lines" value={content.footer.coordinate} onChange={value => update('footer', 'coordinate', value)} /><Field label="Copyright line" value={content.footer.note} onChange={value => update('footer', 'note', value)} /></div></div>
  </div>;
}

export default function AdminPage({ siteContent, onSaveContent, onBackToSite }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [section, setSection] = useState('overview');
  const [content, setContent] = useState(() => structuredClone(siteContent));
  const [savedMessage, setSavedMessage] = useState('');
  const hasChanges = useMemo(() => JSON.stringify(content) !== JSON.stringify(siteContent), [content, siteContent]);

  const setCollection = (key, records) => setContent(current => ({ ...current, [key]: records }));
  const updateRecord = (key, index, field, value) => setContent(current => ({ ...current, [key]: current[key].map((record, i) => i === index ? { ...record, [field]: value } : record) }));
  const deleteRecord = (key, index) => setCollection(key, content[key].filter((_, i) => i !== index));
  const addRecord = key => {
    const blanks = {
      destinations: { id: Date.now(), name: 'New Goa spot', area: 'Goa', type: 'Beach', cost: '₹', image: '', desc: 'Add a short destination description.' },
      deals: { icon: 'Compass', label: 'NEW EXPERIENCE', title: 'A new Goa experience', sub: 'Add details', price: 'From ₹0', color: 'sky', image: '' },
    };
    setCollection(key, [...content[key], blanks[key]]);
  };

  const save = () => {
    onSaveContent(content);
    setSavedMessage('Your changes are saved on this device.');
    window.setTimeout(() => setSavedMessage(''), 3200);
  };
  const reset = () => {
    const restored = structuredClone(defaultSiteContent);
    setContent(restored);
    onSaveContent(restored);
    setSavedMessage('Default site content restored.');
    window.setTimeout(() => setSavedMessage(''), 3200);
  };

  if (!authenticated) return <Login onLogin={() => setAuthenticated(true)} />;

  const currentSection = sections.find(item => item.id === section);
  return <div className="admin-app">
    <aside className="admin-sidebar"><button className="admin-brand" onClick={onBackToSite}><span><Compass size={20} /></span><div><b>Tide</b><small>CONTENT STUDIO</small></div></button><div className="admin-sidebar-label">WORKSPACE</div><nav>{sections.map(({ id, label, icon: Icon }) => <button key={id} className={section === id ? 'active' : ''} onClick={() => { setSection(id); setSavedMessage(''); }}><Icon size={17} />{label}{section === id && <span className="admin-nav-indicator" />}</button>)}</nav><div className="admin-sidebar-bottom"><div className="admin-user"><span className="admin-user-avatar">A</span><div><b>Administrator</b><small>Demo account</small></div></div><button className="admin-logout" onClick={() => setAuthenticated(false)}><LogOut size={15} /> Sign out</button></div></aside>
    <main className="admin-main"><header className="admin-topbar"><div className="admin-breadcrumb"><span>Workspace</span><b>/</b><strong>{currentSection?.label}</strong></div><div className="admin-top-actions"><button className="admin-secondary" onClick={onBackToSite}><Eye size={15} /> View site</button><button className="admin-primary" onClick={save} disabled={!hasChanges}><Save size={15} /> Save changes</button></div></header>
      <div className="admin-content">{section === 'overview' && <Overview content={content} onSelect={setSection} />}
        {section === 'hero' && <HeroEditor content={content} setContent={setContent} />}
        {section === 'destinations' && <CollectionEditor title="Destinations" eyebrow="DISCOVERY CONTENT" description="Add, remove or edit every destination card, including its photo and display details." collection="destinations" records={content.destinations} fields={[{ key: 'name', label: 'Place name' }, { key: 'area', label: 'Area / location' }, { key: 'type', label: 'Category' }, { key: 'cost', label: 'Cost label' }, { key: 'desc', label: 'Description', multiline: true }, { key: 'image', label: 'Image URL', placeholder: 'https://…' }]} updateRecord={updateRecord} deleteRecord={deleteRecord} addRecord={() => addRecord('destinations')} />}
        {section === 'deals' && <CollectionEditor title="Deals & activities" eyebrow="HOMEPAGE CARDS" description="Manage the flight, accommodation and activity cards shown on the homepage." collection="deals" records={content.deals} fields={[{ key: 'label', label: 'Small label' }, { key: 'title', label: 'Card title' }, { key: 'sub', label: 'Short description' }, { key: 'price', label: 'Price text' }, { key: 'icon', label: 'Icon · Plane, Sun or Compass' }, { key: 'color', label: 'Card color · sky, peach or mint' }, { key: 'image', label: 'Optional image URL', placeholder: 'https://…' }]} updateRecord={updateRecord} deleteRecord={deleteRecord} addRecord={() => addRecord('deals')} />}
        {section === 'guide' && <GuideEditor content={content} setContent={setContent} />}
        {section === 'siteText' && <SiteTextEditor content={content} setContent={setContent} />}
        {section === 'overview' && <div className="admin-reset-row"><span>Need a fresh start? Restore the original Tide demo content.</span><button className="admin-secondary danger-text" onClick={reset}><X size={14} /> Restore defaults</button></div>}
      </div>
      {savedMessage && <div className="admin-toast"><Check size={16} />{savedMessage}</div>}
    </main>
  </div>;
}
