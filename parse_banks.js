import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');

const rawData = `Bank Name	Center	Contact Person	Designation	Tel No.	Mob. Contact No.	CNY	EUR	Other Cur	E mail																					
Indian Overseas Bank	Singapore	Hiteshwar Raj Bongshi	Head – Trade Finance	(+)65 6225 1100	+65 93868772	No		SGD	cmtrade@iob.com.sg	iobtrade1@iob.com.sg	chiefexecutive@iob.com.sg	relationshipmgr@iob.com.sg	smcredit@iob.com.sg	cmcredit@iob.com.sg	hiteshwarrajbongshi1@iob.bank.in		They haven’t started quoting yet(we excot internal branch req). Waiting for HO instructions/targets								smtrade@iob.com.sg	tradetops@iob.com.sg	jeetendrakumarpanda@iobnet.co.in	iobtrade@iob.com.sg	iobcredit@iob.com.sg	Jeetendra Kumar
Indian Overseas Bank	Bangkok	Pankaj Kumar 	Manager -- International Division	 +66 222 45411, 12, 13 (TFD), 14, Exnt: 30 or 31/ +66 22250418(D)	 	No			intl@iob.co.th	agm@iob.co.th	adv@iob.co.th																			
	Bangkok	Narendra Kumar Shaw		 +66 222 50416 (D)  Exnt: 30 or 31															66990558874											
Indian Overseas Bank	Colombo	IOB Colombo		Tel : +94115324422 Fax : +94112447900	(+)94115324414	No			colomboch@iob.in	supercolombo@iob.bank.in	IOB-Colombo@iob.in	govindsathish@iob.bank.in	govindsathish@iob.in	tshivaranjani@iob.in	krishnanmanoshanthan@iob.in	rihan@iob.bank.in			hashinijayawardene@iob.in	vijayalakshmip@iobnet.co.in		Hashini Jayawardene								
	Colombo	Govind		(+)919790468635	(+)94762426414																									
	Colombo	Shivaranjani Thevar 	Assistant Manager	(+)94115324412	(+)94766340722																									
	Colombo	Krishnan Shan	Assistant Manager	(+)94115324427	(+)94760705009																									
	Colombo	Rihan Mutaliph	Assistant Manager		(+)94777515295																									
Indian Overseas Bank	Hong Kong	D Santosh Kumar	Senior Manager (Alternate Chief Executive)	(+)852-25245725/ (+) 852-25231648/ (+) 852-25236955/ (+)852-25227572	(+) 852-95794827	No	Yes	HKD	iobhk.trade@iob.in	iobtrade@netvigator.com	iobhk.credit@iob.in	ce@iobhongkong.com					At present they are doing for 90 days				Ramakrishnan Bose									
Indian Overseas Bank	Gift City 	Got Permission to setup															giftcity@iobnet.co.in,	ibugift@iobnet.co.in												
																														
																														
																														
Indian Bank	Gift City 	Jayesh 		Ph. No. 79-61717260/61/62/63/64	(+)918866688808				giftcity@indianbank.co.in	JAYESHPRAKASH.SAMNANI@indianbank.bank.in	cmdsec@indianbank.co.in	LCBKOLKATA@indianbank.bank.in																		
Indian Bank	Singapore	Vijay Dwaivedi		(+)65 6309 4385					dceo@indianbank.sg	credit@indianbank.sg	tf@indianbank.sg																			
	Singapore	Dilip		(+)65 6309 4379																										
	Singapore	Harvinder		(+)65 6309 4372/76																										
Indian Bank	Colombo	Gautam Kumar			(+)917505991175				Gautam.Kumar@indianbank.co.in	colombo@indianbank.co.in	indianbk@sltnet.lk	cmdsec@indian-bank.com	creditmonitoring@indianbank.co.in																	
	Colombo	Situmini Samaraweera		0094112323402/03	(+)94776697939																									
																														
																														
																														
Bank of India	San Francisco	Kaushal Verma 	Vice President & Manager	Tel : 415 956 2129/6326(Extn 221): Fax : 415 956 6328	 +1 415 577 8447	No			Boi.SFA@bankofindia.co.in	Boi.SFA@bankofindia.bank.in																				
	San Francisco	Dinesh K Chourasiya	Assistant Vice President																											
Bank of India	Hong Kong	Saurabh kumar Singh		(+)85225240186/ (+)85228209219		No		HKD	boihk.tf@bankofindia.co.in	Boihk.tf@bankofindia.bank.in																				
	Hong Kong	Ashish Chandel 	Manager Trade Finance & Treasury BO	Phone +852 2820 9227  Fax + 852 2522 3219	(+)9561235846																									
Bank of India	Antwerp	Ashish Kalia	Officer	0032(0) 32018880	(+)919988780014	No	EUR		bankofindiaantwerp@skynet.be	Boi.ANTWERP@bankofindia.co.in							They dont handle small transactions less 1 mio					Rajesh Ranjan Jha								
Bank of India	Tokyo	Sujit Kumar Ghosh		(03) 3212-0911 / (03) 3215-2379 / (03) 3215-2378 / (03) 3212-3424	(+)81332123424				boitokjap@gol.com	Tradefinance.Tokyo@bankofindia.bank.in	Credit.Tokyo@bankofindia.bank.in	Boi.TOKYO@bankofindia.bank.in	Accounts.Tokyo@bankofindia.bank.in																	
Bank of India	Singapore	Somendra Singh	Manager - Trade Finance (Imports)	(+)65 65894039 (DID)/ +65 65894043					Tfimp.Sg@bankofindia.co.in	Credit1.Sg@bankofindia.co.in	Cm.Sg@bankofindia.co.in	ce.sg@bankofindia.bank.in																		
Bank of India	Paris	Rajeev Mohan Awasthi	Branch Head	(+)33 1 42 66 49 97		No	Yes		Credit.paris@bankofindia.bank.in								boi.paris@wanadoo.fr													
	Paris	Sujan Salian	Chief Manager		(+)33 6 22 95 04 06																									
	Paris	Panduranga Kruthiventi	Chief Manager		(+)33 07 58 38 68 71																									
Bank of India	Dubai	Rahul Dilip Ghodake	EX-Manager - Operations & Trade Finance	Ph: +97143273437/ +97143527291/92; FAX: +97143527286		No			boi.dubai@bankofindia.co.in	Tradefinance.Dubai@bankofindia.bank.in	SEO.Dubai@bankofindia.bank.in																			
	Dubai	Meetha T Bhojwani																												
	Dubai	Shubhankit Srivastava	Manager - Operations & Trade Finance																											
Bank of India	Gift City	Arvind Singh	Chief Executive Officer	(+)91-79-69082700/ (+)91-79-66740204 / (+)91-9651671057					GiftCity.Gandhinagar@bankofindia.co.in	Giftcity.IBU@bankofindia.bank.in																				
	Gift City	Sainudheen T T	Deputy CEO																											
Bank of India	New York	Vijay Kumar		(+)1 212 753 6100 Ext 397					Credit.NY@bankofindia.co.in																					
Bank of India	London	Dhruv Jani	Manager – Credit Operations	(O) +44 20 7965 2581 | (F) +44 20 7965 2556 |					tradefinance@bankofindia.uk.com	Manager.credit3@bankofindia.uk.com	manager.london@bankofindia.uk.com	ceeb@bankofindia.uk.com	Boi.LONDONCEO@bankofindia.bank.in	londonbranch@bankofindia.uk.com	Manager-credit1@bankofindia.uk.com		Note: Any transaction related to Russia either directly or indirectly (including shipment from Russia /goods of Russian origin/Funding to or Involvement of Russian Bank / Any Involvement of vessel at Russian Port during the sanction period) is not undertaken by us presently.													
Bank of India	Osaka	Sandip G. Kodgire	Chief Manager/ Branch Manager	(+)81662614035/ (+)81662660525 (Trade Finance)/ Fax: +81-6-6261-6611	(+)819030365600	No		JPY	boi.osaka@bankofindia.co.in 								Ashok Kumar , Hitesh Talreja				Narinder Pal Singh									
																														
																														
UCO Bank 	Singapore	Amit Morey		 +65-65350676, +65-65325944 EXT 306	(+)65 90673345	No			trade@ucobank.com.sg								Ratnesh Kumar		-65350611											
UCO Bank 	Hong Kong	Naveen Ramnani		Tel No.: +852 2524 9240 ; Fax No.: +852 2810 6954 / +852 2524 6619					hkmain@ucobank.co.in	hkmain@uco.bank.in	cesec.hk@uco.bank.in	hk.treasury@uco.bank.in																		
																														
																														
State Bank of India	Israel	Sachin A. Pawaskar 		Phone No.: + 972-(0)3 -756 5408; Fax No.: + 972-(0)3 -600 5376	(+)918902177651	No			mgrtf.israel@statebank.com	vpc.israel@statebank.com							RAJIV RANJAN		Mobile No.: + 972-(0)54-8164640, +91-8085714532											
	Israel	Aman 			(+)919591825216																									
	Israel	Vikas Srivastava	Sr. Vice President (Credit) & Relationship Manager (FI)		(+)972543972986																									
State Bank of India	Frank Furt	Rosalie Dornieden	Vice President Trade	Tel: +49 69 27237 157 Fax: +49 69 27237 138	(+)49 69 27237 103				r.dornieden@statebank-frankfurt.com	svp.trade@statebank-frankfurt.com	trade@statebank-frankfurt.com  																			
	Frank Furt	Vishal Saroj	SVP-Trade	(+)4915214095411	(+)4917662958835																									
State Bank of India	Antwerp	Alok Ranjan Padhi	Manager (Trade & NRI)	(+)32 32050206	(+)918331864581				mgrtrade.antwerp@sbi.co.in	amtrade.antwerp@sbi.co.in																				
	Antwerp	Neha Bajaj	Asst. Manager (Trade & NRI)	(+32)470381599 / (+32) 32051407																										
State Bank of India	Chicago	Manish Sagar		Phone: 001-312-621-0029					avpib.chicago@statebank.com	vpib.chicago@statebank.com																				
State Bank of India	Seoul	Mayank Uniyal	AVP (Trade Finance and Credit)	(+)82 2 737 6316	(+)82 10 2634 0601				avptf.seoul@statebank.com								Pankaj Kamra ❘ AVP (Trade)			Cell:+82-10-9750-4577, Tel: +82-2737 6316				Wats App 8950770359						
State Bank of India	Shanghai	Mayur M. Kamath		TEL  : (0086-21) 54043331 Ext 400, (0086-21) 54042787 (Direct)					mgrcredit.shanghai@statebank.com	headtrade.shanghai@statebank.com	shcredit.shanghai@statebank.com	mgr2credit.shanghai@statebank.com	assttf6.shanghai@statebank.com																	
	Shanghai	Manu Jindal	Manager Trade Finance	(+)8613564575264	(+)862154042786																									
	Shanghai	G K Sahoo	Head Trade		(+)862154042787																									
	Shanghai	Shirley Huang	Supervisor (Credit & TF)	TEL:+86 21  54043331 EXT 324  Direct line: +86 21 54042786, FAX:+86 21 54041803																										
State Bank of India	Gift City			(+)91-79-6171-0907/0906/0904/0901/0911/ (+)91-7600038052					mgrtrade.ibu@statebank.com	loans2.ibu@statebank.com	bh.ibu@statebank.com																			
State Bank of India	Singapore	Ankit Dubey	Assistant Vice President (Trade Finance)	DID: (65) 6228 1136 Main: (65) 6222 2033 Fax: (65) 6228 1138	(65) 82243842				avptf@sbising.com 	headtf@sbising.com							Please note we do not handle/finance any transaction involving (i) any kind of Russian connection, (ii) livestock, (iii) timber,													
	Singapore	Nirmal Kumar	AVP														(iv) precious metals, (v) merchanting trades (where goods are not discharged at Importer’s / LC issuing branch country).													
	Singapore	Seshu 	Head TF														We will not handle any transaction involving US OFAC, EU, UN and/or other sanctioned imposed by other countries/regulators													
	Singapore	Amit Kumar	Head Trade Finance		(+)65 9106 7651																									
State Bank of India	Los Angeles	Kamal Bansal		(+1)213-542-3555 | (+1)213-623-8860 | (+1)213-622-2069 (Fax) 	(+1)323-630-1858				mgrtrade.laa@statebank.com	ceo.laa@statebank.com	vpts.laa@statebank.com																			
State Bank of India	Hong Kong	Shabnam Mishra		(+)852-2597 1255 / (+)852 2597 1251/ Fax: (+)852-868 1966 Fa	(+)852-288 1966				vptrade.hk@statebank.com	avptrade1.hk@statebank.com	trade4.hk@statebank.com	info.hk@statebank.com					trade.hk@sbi.co.in	credit.hk@sbi.co.in	ceo.hk@sbi.co.in											
State Bank of India	London	Mitali Chadd Samant 	AVP Trade	Tel: 002074544319/ +442074544380	(+)07849157228				pavitra.naik.sbiuk@statebank.com	pabina.dahal.sbiuk@statebank.com	trade1.sbiuk@statebank.com	chandan.nayak.sbiuk@statebank.com	headtrade.london@statebank.com	trade2.london@statebank.com	neethu.km.london@statebank.com	trade2.sbiuk@statebank.com	headtrade.sbiuk@statebank.com													
	London	Pavitra Naik		Tel: 004420745413/ +442074544345 (Trade Dir)	2074544380																									
	London	Pabina Dahal	Assistant Manager (TRADE), CDCS, CTFP, Trade Department	(+)442074544373	(+)447979168575																									
	London	Chaitanya Matsa	AVP Trade	(+)442074544464	(+)447506853500																									
	London	Neethu Manoharan	Trade Finance Department	(+)442074544399																										
	London	Shivangi Sharma	Trade Finance Department	(+)44 20 7454 4319	(+)447849157228																									
State Bank of India	Tokyo	Amit Mishra	AVP Trade	(+)81-3-3517-3714 	(+)81-80-4354-6675 				avptf.tokyo@statebank.com	vpcom.tokyo@statebank.com																				
	Tokyo	Shashwati Gupta	Vice President (Trade Finance)	Phone No. +813-3517-3705 / Fax No.     + 813-3277-5621	(+)8190-4717-8725																									
State Bank of India	New York	Mathan		(+)1  212 521 3273					mgrbills.nyb@statebank.com	mgrtrade.nyb@statebank.com	vptrade.nyb@statebank.com																			
	New York	Mandeep Singh		(+)1-212 521 3268																										
State Bank of India	Johannesburg	B V S KALYANI	VP Trade	00-27-11-778-4510	(+)27-639675966				mgrtrade.rsa@statebank.com	trade1.rsa@statebank.com	trade2.rsa@statebank.com																			
	Johannesburg	Kaushik Tapadar	Vice President (Trade)	00-27-11-778-4512	(+)27-810725264																									
	Johannesburg	Hemant P Phalke	AVP(Trade)		(+)27-730364380																									
	Johannesburg	Lucelle Smith	Assistant Trade		(+)27-794667552																									
State Bank of India	Osaka	Abhishek Mahto 	Assistant Vice President 	Tel: +81 6 6271 3695	(+)818048230909				avptf.osaka@statebank.com	VPTRADE.OSAKA@statebank.com																				
	Osaka	Sandeep Kumar Nayak	Vice President	Fax : +81 6 6271 3693	(+)818031357929																									
State Bank of India	Sydney	Saurabh Kumar	AVP	(+)61292415643 (extn: 151)	(+)61478105320				avp.trade@sbisyd.com.au	trade@sbisyd.com.au	vp.trade@sbisyd.com.au	tam.pham@sbisyd.com.au																		
	Sydney	Tam Pham	Trade Operation	(+)61292415643 (extn: 122)																										
	Sydney	Ramandeep Gambhir	Vice President (Trade Finance)	P: (02) 9241-5653 (D), P: (02) 9241-5643 EXT -104 (SWITCH)/ FAX: (02) 9247-0536	 (+)61431090840																									
State Bank of India	Paris	Permanently Closed															sbi.paris@statebank.com	manager.paris@sbi.co.in	ops.paris@sbi.co.in											
State Bank of India	Bahrain			(+)973 17505175/ (+)973-17505156/ (+)973-17505166 / (+)973-17505158 / (+)973-17548033 (Ext. 253 / 214)					trade.wbbbah@statebank.com	credit.rbbh@statebank.com																				
																														
																														
Union Bank of India	Dubai	Pankaj Soni	CEO																											
	Dubai	Biplab Kumar Rana		Ph: +971 4 388 7200 / Fax: +971 4 388 7300					bkrana@unionbankofindia.bank	dealer.dubai@unionbankofindia.bank	headops.difc@unionbankofindia.bank	dubai@unionbankofindia.bank	ceo.dubai@unionbankofindia.bank	ibd@unionbankofindia.bank																
	Dubai	Devraj Mazumdar - Delar		(+)91-9321954321	(+)97143882975																									
Union Bank of India	London	Syam Sunder	MD & CEO	(+)442073324250					credit@unionbankofindiauk.co.uk	kumar.shashiranjan@unionbankofindiauk.co.uk	bruno.dsouza@unionbankofindiauk.co.uk	info@unionbankofindiauk.co.uk	ceo.office@unionbankofindiauk.co.uk				arbind.choudhary@unionbankofindiauk.co.uk			Arbind Choudhary										
	London	Kumar Shashi Ranjan	Head of Corporate Lending																											
	London	Bruno Dsouza	Head of Operations																											
	London	Rakesh Kumar	Branch Head 																											
																														
																														
IDBI Bank	Gift City	Geetesh Kumar		(+)91-7966759927					IBUGiftCity@idbi.co.in	sanjit.bose@idbi.co.in	rahul.sinha@idbi.co.in	neha.gupta@idbi.co.in	bhanupriya.yadav@idbi.co.in				Maulik Trivedi		9601270886											
																														
																														
Bank of Baroda	Singapore	Sumit Kumar	Chief Manager (Trade Finance)	(+)65 6511 4220/ (+)65 6511 4242					ce.singapore@bankofbaroda.com	singapore@bankofbaroda.com																				
	Singapore	Abhisekh Kumar Gupta	Chief Manager (Syndicated Loan)	(+)65 6511 4224																										
	Singapore	Amulya Kumar	Chief Executive	(+)65 6511 4222																										
Bank of Baroda	Brussels								ce.brussels@bankofbaroda.com																					
Bank of Baroda	New York								newyor@bankofbaroda.com																					
Bank of Baroda	Seychelles								seyche@bankofbaroda.com	ce.seychelles@bankofbaroda.com																				
Bank of Baroda	London			(+)44207 457 1587 /(+)44 20 7457 1515/ (+)44207 457 1518					gsc.uk@bankofbaroda.com	nribo@bankofbaroda.com	sma.uk@bankofbaroda.com																			
Bank of Baroda	Sydney								sydney@bankofbaroda.com	ce.australia@bankofbaroda.com	vp.australia@bankofbaroda.com	credit.australia@bankofbaroda.com	treasury.australia@bankofbaroda.com																	
Bank of Baroda	Gift City	Syed Matin Ahmed	Chief Manager - Trade Finance	079-22804622	(+)91-9407994250				relations.ibu@bankofbaroda.com	tf.ibu@bankofbaroda.bank.in																				
		Raman Kumar	Chief Manager	079-22804625	(+)91-9334146900																									
		Vinay Kumar Sharma	Chief Manager - Relationship	(+)91-79-22804600, Direct - 4647	(+)+91-8979495248																									
Bank of Baroda	Hong Kong	Shajan Babu Vayaprath Bungla	Chief Executive 	(+)852 2521 5300 / (+)852 2521 5166 					hongko@bankofbaroda.com	advances.hongko@bankofbaroda.com	trade.hongkong@bankofbaroda.com	hongkong@bankofbaroda.com	ce.hongkong@bankofbaroda.com																	
Bank of Baroda	Dubai			(+)971 4 404 1100					frontofce@bankofbaroda-uae.ae	compmlro.difc@bankofbaroda.com																				
																														
																														
BONY	Mumbai	Velvina Pinto		022-68643952	9820317750/9867508887				velvina.pinto@bnymellon.com	Mumbai_CS@bnymellon.com	Anand.Neettiyath@bnymellon.com																			
	Mumbai	Audrey Yeo							Audrey.Yeo@bnymellon.com																					
	Mumbai	Rajesh R. Nair			Cell : 75063 58850				Rajesh.R.Nair@bnymellon.com																					
																														
																														
Commersz Bank	Mumbai	Atul Deshpande			Mobile: +91 98 672 88877				atul.deshpande@commerzbank.com																					
																														
																														
Citi Bank	Mumbai	Rahul Suri							rahul.suri@citi.com																					
	Mumbai	Akshay Kumar			Mobile: +91 98100 56042				akshay1.kumar@citi.com	ak73645@citi.com																				
																														
																														
HSBC 	Malaysia	Gurjant Singh Gill (Jay)		Phone.      03 80008851					 GtrfPremClientsvsMYH@hsbc.com.my																					
	Malaysia	Edwin Sia Wei Yew		Tieline. 606078853738	Phone.     +603 2075 3738 | +6012 223 1660 (Mobile)				edwin.sia@hsbc.com.my																					
																														
																														
Wells Fargo Bank	Singapore	Vivek Sharma	Vice President	Tel: +65 6395 65 81	Mobile : +65 8786 30 78 |				Vivek.B.Sharma@wellsfargo.com	Kaushik.Mukherjee@wellsfargo.com																				
																														
																														
Zucher Kontal Bank	Mumbai	Ashish Kumar		T: +91 22 42389261	(+)919833633169				ashish@zkbmumbai.com																					
																														
																														
ICICI Bank	Shanghai 	Ashwini Kumar		(+)862180171570	(+)918879770048																									
ICICI Bank	Mumbai	Shubham Shiral			(+91) 9422625542				shiral.shubham@icicibank.com																					
	Mumbai	Siddhi Ghag			(+91)-8657911396				siddhi.ghag@icicibank.com																					
ICICI Bank	Dubai	Deepak Kumar		Tel : +971-43696445	 (+)971 526295736				deepak.kkmar@icicibank.com	figtrade@icicibank.com	siddhi.ghag@icicibank.com	mishra.neha@icicibank.com locusts																		
ICICI Bank	Hong Kong	Sarika		8657549255					Sarika.anand@icicibank.com																					
ICICI Bank	Gift City	Pranat Shah	Head - IBU Operations	(+)91 79 61803207					shah.pranat@icicibank.com	hiren.kansara@icicibank.com	devinkumar.patel@icicibank.com																			
		Hiren Kansara	Capital Market - IBU Operations																											
		Devinkumar Patel	Manager – Trade & Branch Operations																											
																														
																														
																														
																														
Deutsche Bank	Mumbai	Mathew-P George			(+)919699775001				mathew-p.george@db.com	anish.ghosh@db.com																				
	Mumbai	Rohit Chapde			 (+)918879519798/9867282989				rohit.chapde@db.com																					
	Mumbai	Anish Gosh		(+)91 (22) 7180 4291	(+)91 98193 77011																									
`;

// Simple but robust email validator
function isValidEmail(email) {
  return typeof email === 'string' && email.includes('@') && email.includes('.') && !email.includes('(') && !email.includes(')') && !email.includes(',');
}

function parseText() {
  const lines = rawData.split('\n');
  const recipients = [];
  
  let currentBank = 'Unknown Bank';
  let currentCenter = 'Unknown Center';
  
  // Headers start on row 0, data starts on row 1
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const cols = lines[i].split('\t').map(c => c.trim());
    if (cols.length < 3) continue;
    
    // Propagate Bank and Center down if empty
    if (cols[0]) {
      currentBank = cols[0];
    }
    if (cols[1]) {
      currentCenter = cols[1];
    }
    
    const contactPerson = cols[2] || '';
    
    // Find all valid email addresses in the columns
    const emailsInLine = [];
    for (let c = 4; c < cols.length; c++) {
      const val = cols[c];
      if (!val) continue;
      
      // Some cells contain multiple emails separated by commas or spaces
      const parts = val.split(/[,;\s]+/).map(p => p.trim());
      for (const p of parts) {
        if (isValidEmail(p)) {
          emailsInLine.push(p.toLowerCase());
        }
      }
    }
    
    if (emailsInLine.length === 0) continue;
    
    // Add distinct emails as recipients
    emailsInLine.forEach(email => {
      // Avoid duplicate emails
      if (recipients.some(r => r.email === email)) return;
      
      recipients.push({
        id: Math.random().toString(36).substr(2, 9),
        name: contactPerson || `${currentBank} (${currentCenter} Contact)`,
        email: email,
        company: currentBank,
        tags: [currentCenter],
        createdAt: new Date().toISOString()
      });
    });
  }
  
  return recipients;
}

function run() {
  console.log('Parsing bank data...');
  const newRecipients = parseText();
  console.log(`Parsed ${newRecipients.length} unique bank contacts!`);
  
  if (!fs.existsSync(DB_FILE)) {
    console.error('db.json does not exist. Initializing new DB file.');
    fs.writeFileSync(DB_FILE, JSON.stringify({ recipients: [], templates: [], settings: {}, history: [] }, null, 2));
  }
  
  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    const db = JSON.parse(content);
    
    // We can empty old mockup contacts if we want, or keep templates and settings intact.
    // Let's replace the recipients list entirely with the parsed bank details!
    db.recipients = newRecipients;
    
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
    console.log('Successfully saved to db.json!');
  } catch (err) {
    console.error('Error reading/writing db.json:', err);
  }
}

run();
