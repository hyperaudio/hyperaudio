import React from 'react';
import type { NextPage } from 'next';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const Root = styled('main', {
  // shouldForwardProp: (prop: any) => prop !== 'isActive',
})(() =>
  // {theme}
  ({}),
);

const TermsOfService: NextPage = () => (
  <Root>
    <Container fixed maxWidth="md" sx={{ py: { xs: 6, lg: 12 } }}>
      <Typography variant="h1" gutterBottom>
        Hyperaudio Terms of Service
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 6, mb: 3 }}>
        1. Your Acceptance
      </Typography>
      <Typography variant="body2" gutterBottom>
        By using or visiting the Hyperaudio website or any Hyperaudio products, software, data feeds, and services
        provided to you on, from, or through the Hyperaudio website (known collectively as the “Service”) you signify
        your agreement to (1) these terms and conditions (the “Terms of Service”), and (2) Hyperaudio’s privacy policy
        incorporated herein by reference. If you do not agree to any of these terms, or the Hyperaudio privacy policy,
        please do not use the Service.
      </Typography>
      <Typography variant="body2" gutterBottom>
        Hyperaudio may, in its sole discretion, modify or revise these Terms of Service and policies at any time, and
        you agree to be bound by such modifications or revisions. Nothing in these Terms of Service shall be deemed to
        confer any third-party rights or benefits.
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 6, mb: 3 }}>
        2. Service
      </Typography>
      <Typography variant="body2" gutterBottom>
        These Terms of Service apply to all users of the Service, including users who are also contributors of Content
        on the Service. “Content” includes the text, software, graphics, interactive features and other materials you
        may view on, access through, or contribute to the Service. The Service includes all aspects of Hyperaudio,
        including but not limited to all products, software and services offered via the Hyperaudio website and other
        applications.
      </Typography>
      <Typography variant="body2" gutterBottom>
        The Service may contain links to third party websites that are not owned or controlled by Hyperaudio. Hyperaudio
        has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third
        party websites. In addition, Hyperaudio will not and cannot censor or edit the content of any third-party site.
        By using the Service, you expressly relieve Hyperaudio from any and all liability arising from your use of any
        third-party website.
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 6, mb: 3 }}>
        3. General Use of the Service—Permissions and Restrictions
      </Typography>
      <Typography variant="body2" gutterBottom>
        Hyperaudio hereby grants you permission to access and use the Service as set forth in these Terms of Service,
        provided that:
      </Typography>
      <ul>
        <li>
          <Typography variant="body2" gutterBottom>
            You agree not to use or launch any automated system, including without limitation, “robots,” “spiders,” or
            “offline readers,” that accesses the Service in a manner that sends more request messages to the Hyperaudio
            servers in a given period of time than a human can reasonably produce in the same period by using a
            conventional on-line web browser. Notwithstanding the foregoing, Hyperaudio grants the operators of public
            search engines permission to use spiders to copy materials from the site for the sole purpose of creating
            publicly available searchable indices of the materials. Hyperaudio reserves the right to revoke these
            exceptions either generally or in specific cases.
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            You agree not to collect or harvest any personally identifiable information, including account names, from
            the Service, nor to use the communication systems provided by the Service (e.g., comments, email) for any
            commercial solicitation purposes. You agree not to solicit, for commercial purposes, any users of the
            Service with respect to their Content.
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            In your use of the Service, you will comply with all applicable laws.
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            Hyperaudio reserves the right to discontinue any aspect of the Service at any time.
          </Typography>
        </li>
      </ul>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 6, mb: 3 }}>
        4. Your Use of Content
      </Typography>
      <Typography variant="body2" gutterBottom>
        In addition to the general restrictions above, the following restrictions and conditions apply specifically to
        your use of Content.
      </Typography>
      <ul>
        <li>
          <Typography variant="body2" gutterBottom>
            Content is provided to you AS IS. You shall not copy, reproduce, distribute, transmit, broadcast, display,
            sell, license, or otherwise exploit any Content for any other purposes without the prior written consent of
            the respective licensors of the Content.
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            You understand that when using the Service, you will be exposed to Content from a variety of sources, and
            that Hyperaudio is not responsible for the accuracy, usefulness, safety, or intellectual property rights of
            or relating to such Content. You further understand and acknowledge that you may be exposed to Content that
            is inaccurate, offensive, indecent, or objectionable, and you agree to waive, and hereby do waive, any legal
            or equitable rights or remedies you have or may have against Hyperaudio with respect thereto, and, to the
            extent permitted by applicable law, agree to indemnify and hold harmless Hyperaudio, its owners, operators,
            affiliates, licensors, and licensees to the fullest extent allowed by law regarding all matters related to
            your use of the Service.
          </Typography>
        </li>
      </ul>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 6, mb: 3 }}>
        5. Your Content and Conduct
      </Typography>
      <Typography variant="body2" gutterBottom>
        As an Hyperaudio account holder you may submit Content to the Service, including captions and subtitles. You
        understand that Hyperaudio does not guarantee any confidentiality with respect to any Content you submit. You
        affirm, represent, and warrant that you own or have the necessary licenses, rights, consents, and permissions to
        publish Content you submit.
      </Typography>
      <Typography variant="body2" gutterBottom>
        As between Hyperaudio and the copyright owners of the videos and subtitles on hyperaud.io and all Intellectual
        Property Rights in or relating to any of the foregoing, are and will remain the exclusive property of copyright
        owners or its licensors. Users hereby grants Hyperaudio a limited, non-exclusive, royalty-free, license to copy,
        reproduce, distribute, and display Submissions (including subtitles, captions, or translations created through
        the Hyperaudio Platform Services) for the sole purpose of providing Hyperaudio Platform Services during the
        Term. Hyperaudio does not claim any additional rights and copyright of all audio, videos and all subtitles and
        other derivative works remain the property of the publisher.
      </Typography>
      <Typography variant="body2" gutterBottom>
        For clarity, you retain all of your ownership rights in your Content. By submitting Content to Hyperaudio, you
        hereby grant Hyperaudio a worldwide, non-exclusive, royalty-free, license to use, reproduce, distribute, prepare
        derivative works of, display, and transmit the Content in connection with the Service and Hyperaudio (and its
        successors’ and affiliates’) business, including without limitation for promoting and redistributing part or all
        of the Service (and derivative works thereof) in any formats and through any media channels. These promotional
        rights do not apply to Hyperaudio partners who have separate agreements for Hyperaudio services. You also hereby
        grant each user of the Service a non-exclusive license to access your Content through the Service, and to use,
        reproduce, distribute, display and perform such Content as permitted through the functionality of the Service
        and under these Terms of Service. You also hereby grant each user of the Service a non-exclusive license to
        improve your Content through the Service by editing and/or translating your Content. The above licenses granted
        by you in the Content you submit to the Service terminate within a commercially reasonable time after you remove
        or delete your video from the Service. You understand and agree, however, that Hyperaudio may retain, but not
        display, distribute, or perform, server copies of your captions and subtitles that have been removed or deleted.
        The above licenses granted by you in user comments you submit are perpetual and irrevocable.
      </Typography>
      <Typography variant="body2" gutterBottom>
        You further agree that Content you submit to the Service will not contain third party copyrighted material, or
        material that is subject to other third party proprietary rights, unless you have permission from the rightful
        owner of the material or you are otherwise legally entitled to post the material and to grant Hyperaudio all of
        the license rights granted herein.
      </Typography>
      <Typography variant="body2" gutterBottom>
        Hyperaudio does not endorse any Content submitted to the Service by any user or other licensor, or any opinion,
        recommendation, or advice expressed therein, and Hyperaudio expressly disclaims any and all liability in
        connection with Content. Hyperaudio does not permit copyright infringing activities and infringement of
        intellectual property rights on the Service, and Hyperaudio will remove all Content if properly notified that
        such Content infringes on another’s intellectual property rights.
      </Typography>
      <Typography variant="body2" gutterBottom>
        Hyperaudio reserves the right to remove Content without prior notice.
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 6, mb: 3 }}>
        6. Account Termination Policy
      </Typography>
      <Typography variant="body2" gutterBottom>
        Hyperaudio will terminate a user’s access to the Service if, under appropriate circumstances, the user is
        determined to be an infringer.
      </Typography>
      <Typography variant="body2" gutterBottom>
        Hyperaudio reserves the right to decide whether Content violates these Terms of Service for reasons other than
        copyright infringement, such as, but not limited to, inappropriate content, or excessive length. Hyperaudio may
        at any time, without prior notice and in its sole discretion, remove such Content and/or terminate a user’s
        account for submitting such material in violation of these Terms of Service.
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 6, mb: 3 }}>
        7. Digital Millennium Copyright Act
      </Typography>
      <Typography variant="body2" gutterBottom>
        If you are a copyright owner or an agent thereof and believe that any Content infringes upon your copyrights,
        you may submit a notification pursuant to the Digital Millennium Copyright Act (“DMCA”) by providing our
        Copyright Agent with the following information in writing (see 17 U.S.C 512(c)(3) for further detail):
      </Typography>
      <ul>
        <li>
          <Typography variant="body2" gutterBottom>
            A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive
            right that is allegedly infringed;
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            Identification of the copyrighted work claimed to have been infringed, or, if multiple copyrighted works at
            a single online site are covered by a single notification, a representative list of such works at that site;
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            Identification of the material that is claimed to be infringing or to be the subject of infringing activity
            and that is to be removed or access to which is to be disabled and information reasonably sufficient to
            permit the service provider to locate the material;
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            Information reasonably sufficient to permit the service provider to contact you, such as an address,
            telephone number, and, if available, an electronic mail;
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            A statement that you have a good faith belief that use of the material in the manner complained of is not
            authorized by the copyright owner, its agent, or the law; and
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            A statement that the information in the notification is accurate, and under penalty of perjury, that you are
            authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.
          </Typography>
        </li>
      </ul>
      <Typography variant="body2" gutterBottom>
        Hyperaudio’s designated Copyright Agent to receive notifications of claimed infringement is Dan Schultz, 239
        Glenwood Rd., Elkins Park, PA, 19027 email: dan@biffud.com. For clarity, only DMCA notices should go to the
        Copyright Agent; any other feedback, comments, requests for technical support, and other communications should
        be directed to Mark Boas, mark@hyperaud.io. You acknowledge that if you fail to comply with all of the
        requirements of this Section 5(D), your DMCA notice may not be valid.
      </Typography>
      <Typography variant="body2" gutterBottom>
        Counter-Notice. If you believe that your Content that was removed (or to which access was disabled) is not
        infringing, or that you have the authorization from the copyright owner, the copyright owner’s agent, or
        pursuant to the law, to post and use the material in your Content, you may send a counter-notice containing the
        following information to the Copyright Agent:
      </Typography>
      <ul>
        <li>
          <Typography variant="body2" gutterBottom>
            Your physical or electronic signature; Identification of the Content that has been removed or to which
            access has been disabled and the location at which the Content appeared before it was removed or disabled:
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            A statement that you have a good faith belief that the Content was removed or disabled as a result of
            mistake or a misidentification of the Content; and
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            Your name, address, telephone number, and e-mail address, a statement that you consent to the jurisdiction
            of the federal court in Philadelphia, Pennsylvania, and a statement that you will accept service of process
            from the person who provided notification of the alleged infringement.
          </Typography>
        </li>
      </ul>
      <Typography variant="body2" gutterBottom>
        If a counter-notice is received by the Copyright Agent, Hyperaudio may send a copy of the counter-notice to the
        original complaining party informing that person that it may replace the removed Content or cease disabling it
        in 10 business days. Unless the copyright owner files an action seeking a court order against the Content
        provider, member or user, the removed Content may be replaced, or access to it restored, in 10 to 14 business
        days or more after receipt of the counter-notice, at Hyperaudio’s sole discretion.
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 6, mb: 3 }}>
        8. Warranty Disclaimer
      </Typography>
      <Typography variant="body2" gutterBottom>
        YOU AGREE THAT YOUR USE OF THE SERVICES SHALL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW,
        HYPERAUDIO, ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN
        CONNECTION WITH THE SERVICES AND YOUR USE THEREOF. HYPERAUDIO MAKES NO WARRANTIES OR REPRESENTATIONS ABOUT THE
        ACCURACY OR COMPLETENESS OF THIS SITE’S CONTENT OR THE CONTENT OF ANY SITES LINKED TO THIS SITE AND ASSUMES NO
        LIABILITY OR RESPONSIBILITY FOR ANY (I) ERRORS, MISTAKES, OR INACCURACIES OF CONTENT, (II) PERSONAL INJURY OR
        PROPERTY DAMAGE, OF ANY NATURE WHATSOEVER, RESULTING FROM YOUR ACCESS TO AND USE OF OUR SERVICES, (III) ANY
        UNAUTHORIZED ACCESS TO OR USE OF OUR SECURE SERVERS AND/OR ANY AND ALL PERSONAL INFORMATION AND/OR FINANCIAL
        INFORMATION STORED THEREIN, (IV) ANY INTERRUPTION OR CESSATION OF TRANSMISSION TO OR FROM OUR SERVICES, (IV) ANY
        BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE WHICH MAY BE TRANSMITTED TO OR THROUGH OUR SERVICES BY ANY THIRD
        PARTY, AND/OR (V) ANY ERRORS OR OMISSIONS IN ANY CONTENT OR FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A
        RESULT OF THE USE OF ANY CONTENT POSTED, EMAILED, TRANSMITTED, OR OTHERWISE MADE AVAILABLE VIA THE SERVICES.
        Hyperaudio DOES NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR ANY PRODUCT OR SERVICE ADVERTISED
        OR OFFERED BY A THIRD PARTY THROUGH THE SERVICES OR ANY HYPERLINKED SERVICES OR FEATURED IN ANY BANNER OR OTHER
        ADVERTISING, AND HYPERAUDIO WILL NOT BE A PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR MONITORING ANY TRANSACTION
        BETWEEN YOU AND THIRD-PARTY PROVIDERS OF PRODUCTS OR SERVICES. AS WITH THE PURCHASE OF A PRODUCT OR SERVICE
        THROUGH ANY MEDIUM OR IN ANY ENVIRONMENT, YOU SHOULD USE YOUR BEST JUDGMENT AND EXERCISE CAUTION WHERE
        APPROPRIATE.
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 6, mb: 3 }}>
        9. Limitation of Liability
      </Typography>
      <Typography variant="body2" gutterBottom>
        IN NO EVENT SHALL HYPERAUDIO, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS, BE LIABLE TO YOU FOR ANY DIRECT,
        INDIRECT, INCIDENTAL, SPECIAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES WHATSOEVER RESULTING FROM ANY (I) ERRORS,
        MISTAKES, OR INACCURACIES OF CONTENT, (II) PERSONAL INJURY OR PROPERTY DAMAGE, OF ANY NATURE WHATSOEVER,
        RESULTING FROM YOUR ACCESS TO AND USE OF OUR SERVICES, (III) ANY UNAUTHORIZED ACCESS TO OR USE OF OUR SECURE
        SERVERS AND/OR ANY AND ALL PERSONAL INFORMATION AND/OR FINANCIAL INFORMATION STORED THEREIN, (IV) ANY
        INTERRUPTION OR CESSATION OF TRANSMISSION TO OR FROM OUR SERVICES, (IV) ANY BUGS, VIRUSES, TROJAN HORSES, OR THE
        LIKE, WHICH MAY BE TRANSMITTED TO OR THROUGH OUR SERVICES BY ANY THIRD PARTY, AND/OR (V) ANY ERRORS OR OMISSIONS
        IN ANY CONTENT OR FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF YOUR USE OF ANY CONTENT POSTED,
        EMAILED, TRANSMITTED, OR OTHERWISE MADE AVAILABLE VIA THE SERVICES, WHETHER BASED ON WARRANTY, CONTRACT, TORT,
        OR ANY OTHER LEGAL THEORY, AND WHETHER OR NOT THE COMPANY IS ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. THE
        FOREGOING LIMITATION OF LIABILITY SHALL APPLY TO THE FULLEST EXTENT PERMITTED BY LAW IN THE APPLICABLE
        JURISDICTION.
      </Typography>
      <Typography variant="body2" gutterBottom>
        YOU SPECIFICALLY ACKNOWLEDGE THAT HYPERAUDIO SHALL NOT BE LIABLE FOR CONTENT OR THE DEFAMATORY, OFFENSIVE, OR
        ILLEGAL CONDUCT OF ANY THIRD PARTY AND THAT THE RISK OF HARM OR DAMAGE FROM THE FOREGOING RESTS ENTIRELY WITH
        YOU.
      </Typography>
      <Typography variant="body2" gutterBottom>
        The Service is controlled and offered by Hyperaudio from its facilities in the United States of America.
        Hyperaudio makes no representations that the Service is appropriate or available for use in other locations.
        Those who access or use the Service from other jurisdictions do so at their own volition and are responsible for
        compliance with local law.
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 6, mb: 3 }}>
        10. Indemnity
      </Typography>
      <Typography variant="body2" gutterBottom>
        To the extent permitted by applicable law, you agree to defend, indemnify and hold harmless Hyperaudio, its
        parent corporation, officers, directors, employees and agents, from and against any and all claims, damages,
        obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney’s fees)
        arising from: (i) your use of and access to the Service; (ii) your violation of any term of these Terms of
        Service; (iii) your violation of any third party right, including without limitation any copyright, property, or
        privacy right; or (iv) any claim that your Content caused damage to a third party. This defense and
        indemnification obligation will survive theseTerms of Service and your use of the Service.
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 6, mb: 3 }}>
        11. Ability to Accept Terms of Service
      </Typography>
      <Typography variant="body2" gutterBottom>
        You affirm that you are either more than 18 years of age, or an emancipated minor, or possess legal parental or
        guardian consent, and are fully able and competent to enter into the terms, conditions, obligations,
        affirmations, representations, and warranties set forth in these Terms of Service, and to abide by and comply
        with these Terms of Service.
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 6, mb: 3 }}>
        12. Assignment
      </Typography>
      <Typography variant="body2" gutterBottom>
        These Terms of Service, and any rights and licenses granted hereunder, may not be transferred or assigned by
        you, but may be assigned by Hyperaudio without restriction.
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 6, mb: 3 }}>
        13. General
      </Typography>
      <Typography variant="body2" gutterBottom>
        You agree that: (i) the Service shall be deemed solely based in Pennsylvania; and (ii) the Service shall be
        deemed a passive website that does not give rise to personal jurisdiction over Hyperaudio, either specific or
        general, in jurisdictions other than Pennsylvania. These Terms of Service shall be governed by the internal
        substantive laws of the State of Pennsylvania, without respect to its conflict of laws principles. Any claim or
        dispute between you and Hyperaudio that arises in whole or in part from the Service shall be decided exclusively
        by a court of competent jurisdiction located in Philadelphia, Pennsylvania.
      </Typography>
      <Typography variant="body2" gutterBottom>
        These Terms of Service, together with the Privacy Policy at http://hyper.audio/privacy/ and any other legal
        notices published by Hyperaudio on the Service, shall constitute the entire agreement between you and Hyperaudio
        concerning the Service. If any provision of these Terms of Service is deemed invalid by a court of competent
        jurisdiction, the invalidity of such provision shall not affect the validity of the remaining provisions of
        these Terms of Service, which shall remain in full force and effect. No waiver of any term of this these Terms
        of Service shall be deemed a further or continuing waiver of such term or any other term, and Hyperaudio’s
        failure to assert any right or provision under these Terms of Service shall not constitute a waiver of such
        right or provision. Hyperaudio reserves the right to amend these Terms of Service at any time and without
        notice, and it is your responsibility to review these Terms of Service for any changes. Your use of the Service
        following any amendment of these Terms of Service will signify your assent to and acceptance of its revised
        terms.
      </Typography>
      <Typography variant="body2" gutterBottom>
        YOU AND HYPERAUDIO AGREE THAT ANY CAUSE OF ACTION ARISING OUT OF OR RELATED TO THE SERVICES MUST COMMENCE WITHIN
        ONE (1) YEAR AFTER THE CAUSE OF ACTION ACCRUES. OTHERWISE, SUCH CAUSE OF ACTION IS PERMANENTLY BARRED.
      </Typography>
    </Container>
  </Root>
);

export default TermsOfService;
