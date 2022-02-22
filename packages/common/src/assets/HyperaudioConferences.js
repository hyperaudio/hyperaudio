import React from 'react';

import { styled } from '@mui/material/styles';

const PREFIX = `HyperaudioConferences`;
const classes = {
  root: `${PREFIX}-root`,
  path: `${PREFIX}-path`,
};

const Root = styled('span', {
  shouldForwardProp: prop => !['size', 'fill'].includes(prop),
})(({ theme, fill, size }) => ({
  display: 'inline-block',
  lineHeight: 0,
  [`& svg`]: {
    width: 'auto',
    height: theme.spacing(size === 'large' ? 6 : size === 'small' ? 4 : 5),
    [theme.breakpoints.up('lg')]: {
      height: theme.spacing(size === 'large' ? 7 : size === 'small' ? 5 : 6),
    },
  },
  [`& .${classes.path}`]: {
    fill: 'currentColor',
  },
}));

export default function HyperaudioConferences(props) {
  return (
    <Root className={classes.root} {...props} aria-label="Hyperaudio Conferences">
      <svg width="806" height="275" viewBox="0 0 806 275" fill="none" xmlns="http://www.w3.org/2000/svg">
        <title>Hyperaudio Conferences</title>
        <path
          className={classes.path}
          clip-rule="evenodd"
          fill-rule="evenodd"
          id="hyperaudio-logo"
          d="M4.3026 66.3026C7.05751 63.5477 10.794 62 14.69 62C18.586 62 22.3225 63.5477 25.0774 66.3026C27.8323 69.0575 29.38 72.794 29.38 76.69V164.85C29.38 168.746 27.8323 172.482 25.0774 175.237C22.3225 177.992 18.586 179.54 14.69 179.54C10.794 179.54 7.05751 177.992 4.3026 175.237C1.54769 172.482 0 168.746 0 164.85V76.69C0 72.794 1.54769 69.0575 4.3026 66.3026ZM207.33 120.42C204.44 120.361 201.566 120.88 198.879 121.946C196.191 123.012 193.744 124.605 191.68 126.63V98.9C191.723 97.8991 191.568 96.8996 191.224 95.9586C190.881 95.0177 190.355 94.1537 189.677 93.4162C188.999 92.6788 188.182 92.0822 187.273 91.6608C186.364 91.2393 185.381 91.0012 184.38 90.96H184C181.953 90.9333 179.98 91.7195 178.512 93.1461C177.044 94.5727 176.202 96.5233 176.17 98.57V172.1C176.111 174.146 176.867 176.132 178.271 177.621C179.676 179.11 181.614 179.98 183.66 180.04H184C186.022 180.064 187.971 179.284 189.418 177.873C190.866 176.461 191.694 174.532 191.72 172.51V172.1V145.51C191.72 138.95 196.21 134.46 202.54 134.46C208.87 134.46 213.13 138.84 213.13 145.51V172.1C213.097 173.11 213.263 174.117 213.619 175.062C213.975 176.008 214.514 176.875 215.205 177.612C215.896 178.349 216.725 178.943 217.646 179.36C218.566 179.777 219.56 180.008 220.57 180.04H220.84C221.878 180.062 222.91 179.87 223.871 179.475C224.831 179.081 225.7 178.493 226.424 177.748C227.147 177.003 227.709 176.117 228.075 175.146C228.441 174.174 228.603 173.137 228.55 172.1V143.32C228.51 129.51 220.11 120.42 207.33 120.42ZM728.651 107.63C726.836 109.367 724.412 110.323 721.9 110.29C719.376 110.349 716.931 109.404 715.103 107.662C713.275 105.92 712.213 103.524 712.15 101V100.9C712.243 98.3744 713.315 95.9841 715.139 94.235C716.963 92.4858 719.396 91.515 721.923 91.528C724.451 91.541 726.874 92.5367 728.68 94.3046C730.486 96.0724 731.533 98.4736 731.6 101C731.524 103.511 730.465 105.892 728.651 107.63ZM328.76 127.68C332.67 123.07 338.77 120.42 346.14 120.42C362.14 120.42 373.74 132.81 373.74 150.07C373.74 167.33 362.11 179.99 346.11 179.99C339 179.99 333.02 177.46 329.11 173.09V193.09C329.1 194.11 328.888 195.119 328.488 196.057C328.088 196.996 327.507 197.847 326.778 198.561C326.049 199.275 325.186 199.838 324.24 200.219C323.293 200.6 322.281 200.79 321.26 200.78C320.24 200.769 319.232 200.558 318.293 200.158C317.354 199.758 316.504 199.177 315.789 198.448C315.075 197.719 314.512 196.856 314.131 195.91C313.75 194.963 313.56 193.95 313.57 192.93V127.73C313.588 126.736 313.802 125.756 314.2 124.845C314.597 123.934 315.171 123.11 315.887 122.421C316.603 121.732 317.448 121.191 318.373 120.829C319.299 120.466 320.287 120.29 321.28 120.31C323.248 120.299 325.14 121.069 326.542 122.45C327.944 123.831 328.742 125.712 328.76 127.68ZM328.88 150.12C328.88 159.44 334.75 165.88 343.26 165.88C351.78 165.88 358 159.46 358 150.23C358 141 351.89 134.46 343.26 134.46C334.63 134.46 328.88 140.8 328.88 150.12ZM621.11 128.25V153.57C621.11 169.22 610.29 180 594.98 180.04C579.44 180.04 568.62 169.22 568.62 153.57V128.09C568.641 126.029 569.48 124.061 570.952 122.619C572.425 121.177 574.409 120.379 576.47 120.4C578.531 120.421 580.499 121.26 581.941 122.732C583.383 124.205 584.181 126.189 584.16 128.25V154.83C584.16 161.16 588.77 165.77 594.98 165.77C601.19 165.77 605.57 161.16 605.57 154.83V128.09C605.591 126.029 606.43 124.061 607.902 122.619C609.375 121.177 611.359 120.379 613.42 120.4C615.481 120.421 617.449 121.26 618.891 122.732C620.333 124.205 621.131 126.189 621.11 128.25ZM472.75 150.23C472.75 141.48 477.81 136.07 486.1 135.5C490.47 135.04 493.35 132.16 493.35 128.02C493.402 127.087 493.257 126.154 492.924 125.281C492.59 124.408 492.076 123.615 491.416 122.954C490.755 122.294 489.962 121.78 489.089 121.447C488.217 121.113 487.283 120.968 486.35 121.02C483.703 121.034 481.089 121.616 478.686 122.727C476.283 123.838 474.146 125.452 472.42 127.46C472.305 125.558 471.466 123.772 470.074 122.47C468.683 121.168 466.846 120.449 464.94 120.46C463.942 120.444 462.951 120.625 462.023 120.992C461.094 121.36 460.248 121.906 459.531 122.601C458.814 123.295 458.241 124.124 457.844 125.041C457.448 125.957 457.236 126.942 457.22 127.94V128.29V172.1C457.169 174.138 457.927 176.114 459.329 177.594C460.731 179.075 462.662 179.94 464.7 180H465C466.002 180.012 466.997 179.826 467.927 179.454C468.857 179.081 469.705 178.529 470.422 177.829C471.139 177.129 471.711 176.294 472.105 175.373C472.499 174.452 472.708 173.462 472.72 172.46V150.23H472.75ZM438.363 166.182C438.662 166.932 438.811 167.733 438.8 168.54C438.8 171.07 437.65 172.91 434.89 174.71C429.522 178.229 423.228 180.07 416.81 180C398.86 180 385.62 167.11 385.62 150.19C385.62 133.27 398.4 120.38 415.2 120.38C430.74 120.38 442.25 131.66 442.25 147.09V147.43C442.25 152.27 438.8 155.37 433.73 155.37H401.28C403.12 162.51 408.87 166.65 417.28 166.65C421.463 166.667 425.568 165.513 429.13 163.32C430.125 162.675 431.284 162.328 432.47 162.32H432.73C433.537 162.329 434.335 162.497 435.077 162.815C435.819 163.133 436.491 163.594 437.055 164.171C437.619 164.749 438.063 165.432 438.363 166.182ZM427.17 144.51C426.94 137.71 422.11 133 414.85 133C408.06 133 403 137.45 401.27 144.51H427.17ZM551.36 144.82C551.36 129.28 542.36 120.42 526.73 120.42C518.44 120.42 510.96 122.95 506.13 127.42C504.06 129.42 502.91 131.42 502.91 133.63C502.927 134.48 503.111 135.318 503.452 136.096C503.793 136.875 504.284 137.579 504.897 138.167C505.509 138.756 506.232 139.218 507.024 139.528C507.816 139.837 508.66 139.987 509.51 139.97H509.58C511.286 139.921 512.919 139.269 514.19 138.13C517.175 135.398 521.073 133.879 525.12 133.87C532.03 133.87 535.83 137.56 535.83 143.87V146.4H521.55C508.19 146.43 500 152.76 500 163C500 173.24 508 180 519.69 180C526.48 180 532.23 177.81 536.38 173.9C536.736 175.735 537.758 177.374 539.25 178.5C540.742 179.626 542.598 180.161 544.46 180.001C546.323 179.841 548.06 178.997 549.337 177.632C550.615 176.268 551.343 174.479 551.38 172.61V172.17L551.36 144.82ZM535.82 157.36C535.82 163.81 530.64 168.64 523.82 168.64C518.76 168.64 515.65 166.23 515.65 162.43C515.65 158.63 518.41 156.67 523.59 156.67H535.79L535.82 157.36ZM775.23 120.42C792.26 120.42 805.84 133.54 805.84 150.12C805.84 166.69 792.14 179.93 775.11 179.93C758.08 179.93 744.72 166.82 744.72 150.12C744.72 133.42 758.2 120.42 775.23 120.42ZM760.49 150.23C760.49 159.21 766.71 165.65 775.23 165.65C783.63 165.65 790 159.21 790 150.23C790 141.25 783.75 134.58 775.23 134.58C766.71 134.58 760.49 141.25 760.49 150.23ZM293.08 120.42C291.626 120.39 290.196 120.789 288.968 121.566C287.739 122.343 286.766 123.464 286.17 124.79L270.75 158.52L255.67 124.79C255.108 123.464 254.16 122.338 252.948 121.558C251.737 120.779 250.32 120.382 248.88 120.42C246.889 120.43 244.981 121.218 243.563 122.615C242.145 124.013 241.329 125.909 241.29 127.9C241.322 129.189 241.665 130.452 242.29 131.58L262 175L259.93 179.6C257.4 184.78 254.06 186.86 249.11 186.86C248.962 186.86 248.793 186.837 248.6 186.812L248.6 186.812H248.6C248.348 186.779 248.058 186.74 247.73 186.74C245.941 186.672 244.198 187.318 242.886 188.535C241.573 189.752 240.797 191.441 240.73 193.23C240.725 193.293 240.725 193.357 240.73 193.42C240.715 194.709 241.079 195.973 241.775 197.058C242.472 198.142 243.472 198.998 244.65 199.52C246.722 200.401 248.958 200.831 251.21 200.78C261.56 200.78 268.47 195.49 274.57 182.94L299.66 131.49C300.271 130.4 300.588 129.17 300.58 127.92C300.551 125.94 299.752 124.049 298.352 122.648C296.951 121.248 295.06 120.448 293.08 120.42ZM682.979 177.915C681.568 176.569 680.721 174.737 680.61 172.79C676.7 177.39 670.6 180 663.23 180C647.23 180 635.65 167.49 635.65 150.23C635.65 132.97 647.27 120.42 663.27 120.42C670.37 120.42 676.36 122.95 680.27 127.21V98.95V98.61C680.284 97.5962 680.498 96.5951 680.899 95.6639C681.301 94.7328 681.881 93.8898 682.609 93.1831C683.336 92.4764 684.195 91.9199 685.137 91.5453C686.079 91.1708 687.086 90.9855 688.1 91H688.5C690.514 91.0859 692.413 91.9644 693.782 93.4442C695.151 94.924 695.88 96.8851 695.81 98.9V172.21V172.64C695.797 173.625 695.59 174.598 695.201 175.503C694.812 176.408 694.248 177.227 693.543 177.914C692.837 178.601 692.003 179.143 691.088 179.508C690.173 179.872 689.195 180.053 688.21 180.04C686.26 180.02 684.39 179.261 682.979 177.915ZM666.11 134.46C657.59 134.46 651.38 141.12 651.38 150.12C651.38 159.32 657.48 165.88 666.11 165.88C674.74 165.88 680.5 159.55 680.5 150.23C680.5 140.91 674.63 134.46 666.11 134.46ZM722 120.39C720.98 120.379 719.968 120.57 719.022 120.951C718.076 121.332 717.214 121.895 716.486 122.61C715.758 123.324 715.177 124.175 714.778 125.113C714.379 126.052 714.169 127.06 714.16 128.08C714.154 128.112 714.151 128.145 714.153 128.178C714.153 128.191 714.154 128.204 714.156 128.218L714.158 128.231L714.16 128.24V172.1C714.126 173.11 714.292 174.117 714.648 175.062C715.004 176.008 715.543 176.875 716.234 177.612C716.925 178.349 717.755 178.943 718.675 179.36C719.596 179.777 720.59 180.008 721.6 180.04H721.87C723.917 180.067 725.89 179.281 727.358 177.854C728.826 176.427 729.668 174.477 729.7 172.43V172.1V128.24C729.71 127.219 729.52 126.205 729.138 125.258C728.757 124.311 728.192 123.448 727.477 122.719C726.762 121.99 725.91 121.409 724.97 121.009C724.031 120.61 723.021 120.399 722 120.39ZM102.85 150.15C99.9423 150.148 97.0993 151.009 94.6805 152.623C92.2618 154.237 90.3761 156.532 89.262 159.218C88.1478 161.904 87.8553 164.86 88.4214 167.712C88.9875 170.564 90.3867 173.184 92.4421 175.241C94.4976 177.298 97.1168 178.699 99.9686 179.267C102.82 179.835 105.777 179.544 108.463 178.432C111.15 177.32 113.446 175.436 115.062 173.018C116.678 170.6 117.54 167.758 117.54 164.85C117.541 162.92 117.162 161.009 116.425 159.225C115.687 157.442 114.605 155.821 113.241 154.456C111.877 153.091 110.257 152.008 108.474 151.269C106.691 150.53 104.78 150.15 102.85 150.15ZM48.3783 110.378C51.1345 107.622 54.872 106.073 58.7698 106.07C62.6668 106.073 66.4032 107.623 69.1578 110.379C71.9125 113.136 73.4598 116.873 73.4598 120.77V164.85C73.3599 168.681 71.7678 172.322 69.0229 174.996C66.2779 177.67 62.5971 179.167 58.7648 179.167C54.9325 179.167 51.2517 177.67 48.5068 174.996C45.7618 172.322 44.1698 168.681 44.0698 164.85V120.77C44.0725 116.872 45.6221 113.135 48.3783 110.378ZM451.14 236.62C452.941 236.594 454.724 236.992 456.343 237.783C457.962 238.573 459.372 239.733 460.46 241.17C460.639 241.404 460.871 241.593 461.137 241.722C461.403 241.85 461.695 241.915 461.99 241.91C462.431 241.916 462.857 241.748 463.177 241.443C463.496 241.139 463.684 240.721 463.7 240.28C463.659 239.704 463.414 239.162 463.01 238.75C461.552 237.013 459.726 235.621 457.665 234.675C455.603 233.729 453.358 233.253 451.09 233.28C448.979 233.227 446.88 233.597 444.915 234.368C442.95 235.139 441.159 236.295 439.647 237.769C438.136 239.243 436.935 241.004 436.115 242.949C435.295 244.894 434.872 246.984 434.872 249.095C434.872 251.206 435.295 253.296 436.115 255.241C436.935 257.186 438.136 258.947 439.647 260.421C441.159 261.895 442.95 263.051 444.915 263.822C446.88 264.593 448.979 264.963 451.09 264.91C453.358 264.951 455.607 264.48 457.669 263.534C459.731 262.587 461.553 261.187 463 259.44C463.404 259.028 463.649 258.486 463.69 257.91C463.674 257.469 463.486 257.051 463.167 256.747C462.847 256.442 462.421 256.275 461.98 256.28C461.684 256.277 461.392 256.344 461.126 256.474C460.86 256.604 460.629 256.795 460.45 257.03C459.353 258.455 457.94 259.607 456.323 260.395C454.706 261.183 452.928 261.585 451.13 261.57C447.882 261.478 444.799 260.123 442.534 257.794C440.27 255.464 439.003 252.344 439.003 249.095C439.003 245.846 440.27 242.726 442.534 240.396C444.799 238.067 447.882 236.712 451.13 236.62H451.14ZM479.845 235.99C482.435 234.241 485.485 233.298 488.61 233.28C490.7 233.248 492.776 233.634 494.715 234.417C496.654 235.2 498.417 236.362 499.9 237.836C501.382 239.311 502.555 241.067 503.348 243.001C504.142 244.936 504.54 247.009 504.52 249.1C504.52 252.225 503.594 255.28 501.86 257.88C500.125 260.479 497.66 262.507 494.775 263.707C491.889 264.907 488.713 265.225 485.647 264.622C482.58 264.019 479.761 262.521 477.545 260.318C475.329 258.114 473.815 255.304 473.195 252.241C472.574 249.178 472.875 246 474.058 243.108C475.242 240.216 477.256 237.739 479.845 235.99ZM476.51 249.05C476.51 256.24 481.66 261.57 488.66 261.57C495.57 261.57 500.76 256.15 500.76 249.05C500.76 241.95 495.62 236.62 488.66 236.62C481.7 236.62 476.51 241.86 476.51 249.05ZM538.19 233.28C537.946 233.284 537.705 233.336 537.481 233.434C537.257 233.532 537.055 233.674 536.887 233.851C536.718 234.028 536.587 234.236 536.5 234.464C536.413 234.693 536.372 234.936 536.38 235.18V257.58L519.08 234.49C518.43 233.61 517.97 233.28 517.36 233.28C516.904 233.292 516.469 233.476 516.143 233.795C515.816 234.114 515.622 234.544 515.6 235V263C515.588 263.245 515.625 263.49 515.711 263.72C515.796 263.95 515.928 264.161 516.097 264.338C516.266 264.516 516.47 264.658 516.696 264.754C516.922 264.851 517.164 264.9 517.41 264.9C517.654 264.896 517.895 264.844 518.119 264.746C518.343 264.648 518.545 264.506 518.713 264.329C518.882 264.153 519.013 263.944 519.1 263.716C519.187 263.487 519.228 263.244 519.22 263V240.6L536.66 264C536.833 264.265 537.064 264.487 537.336 264.648C537.609 264.81 537.914 264.906 538.23 264.93C538.698 264.93 539.146 264.745 539.478 264.415C539.81 264.085 539.997 263.638 540 263.17V235.17C540.011 234.926 539.972 234.682 539.886 234.453C539.8 234.224 539.668 234.015 539.499 233.838C539.33 233.661 539.127 233.521 538.902 233.425C538.677 233.329 538.435 233.28 538.19 233.28ZM555 233.79H570.75C571.171 233.8 571.573 233.97 571.874 234.265C572.175 234.56 572.352 234.959 572.37 235.38C572.369 235.597 572.324 235.811 572.239 236.01C572.154 236.209 572.03 236.39 571.875 236.54C571.719 236.691 571.535 236.81 571.334 236.889C571.132 236.967 570.917 237.005 570.7 237H556.7V247.57H568.12C568.347 247.552 568.575 247.582 568.79 247.656C569.005 247.731 569.202 247.849 569.369 248.004C569.536 248.158 569.669 248.346 569.76 248.554C569.851 248.762 569.898 248.988 569.898 249.215C569.898 249.442 569.851 249.668 569.76 249.876C569.669 250.084 569.536 250.272 569.369 250.426C569.202 250.581 569.005 250.699 568.79 250.774C568.575 250.848 568.347 250.878 568.12 250.86H556.72V263C556.728 263.244 556.687 263.487 556.6 263.716C556.513 263.944 556.382 264.153 556.213 264.329C556.045 264.506 555.843 264.648 555.619 264.746C555.395 264.844 555.154 264.896 554.91 264.9C554.664 264.9 554.422 264.851 554.196 264.754C553.97 264.658 553.766 264.516 553.597 264.338C553.428 264.161 553.296 263.95 553.211 263.72C553.125 263.49 553.088 263.245 553.1 263V235.69C553.094 235.439 553.14 235.189 553.233 234.956C553.327 234.724 553.467 234.512 553.644 234.334C553.822 234.157 554.033 234.017 554.266 233.924C554.499 233.83 554.749 233.785 555 233.79ZM600.71 261.15H585.63V249.65H596.44C596.876 249.655 597.296 249.488 597.609 249.184C597.922 248.881 598.102 248.466 598.11 248.03C598.11 247.813 598.067 247.598 597.982 247.398C597.898 247.198 597.774 247.018 597.618 246.866C597.462 246.715 597.278 246.597 597.075 246.519C596.873 246.44 596.657 246.403 596.44 246.41H585.63V237H600.15C600.367 237.007 600.583 236.97 600.785 236.891C600.988 236.813 601.172 236.695 601.328 236.544C601.484 236.392 601.608 236.212 601.692 236.012C601.777 235.812 601.82 235.597 601.82 235.38C601.817 235.163 601.772 234.949 601.687 234.75C601.601 234.551 601.478 234.37 601.323 234.219C601.168 234.068 600.984 233.948 600.783 233.868C600.582 233.787 600.367 233.747 600.15 233.75H583.69C583.469 233.745 583.25 233.784 583.044 233.866C582.839 233.948 582.653 234.071 582.497 234.227C582.341 234.383 582.218 234.569 582.136 234.774C582.054 234.98 582.015 235.199 582.02 235.42V262.69C582.015 262.911 582.054 263.13 582.136 263.336C582.218 263.541 582.341 263.727 582.497 263.883C582.653 264.039 582.839 264.162 583.044 264.244C583.25 264.326 583.469 264.366 583.69 264.36H600.69C601.124 264.363 601.542 264.194 601.853 263.891C602.163 263.588 602.342 263.174 602.35 262.74C602.342 262.312 602.165 261.905 601.858 261.607C601.551 261.309 601.138 261.145 600.71 261.15ZM631.843 247.868C630.742 249.381 629.168 250.483 627.37 251L635.43 261.91C635.786 262.29 636.001 262.781 636.04 263.3C636.036 263.521 635.988 263.738 635.899 263.94C635.81 264.142 635.682 264.324 635.522 264.476C635.362 264.628 635.173 264.746 634.967 264.824C634.76 264.902 634.54 264.938 634.32 264.93C633.998 264.898 633.688 264.791 633.415 264.617C633.143 264.444 632.915 264.208 632.75 263.93L623.52 251.55H616.52V263.05C616.524 263.291 616.48 263.531 616.391 263.755C616.302 263.979 616.17 264.184 616.002 264.356C615.833 264.529 615.633 264.667 615.411 264.762C615.189 264.857 614.951 264.907 614.71 264.91C614.468 264.912 614.227 264.864 614.004 264.77C613.78 264.677 613.578 264.539 613.409 264.365C613.24 264.192 613.108 263.986 613.02 263.76C612.933 263.534 612.892 263.292 612.9 263.05V235.65C612.897 235.405 612.943 235.162 613.036 234.935C613.129 234.708 613.266 234.502 613.439 234.329C613.612 234.156 613.818 234.019 614.045 233.926C614.272 233.834 614.515 233.787 614.76 233.79H623.66C629.51 233.79 633.45 237.36 633.45 242.65C633.51 244.52 632.944 246.356 631.843 247.868ZM616.52 237V248.31L623.52 248.27C627.37 248.27 629.69 246.1 629.69 242.66C629.69 239.22 627.33 237 623.52 237H616.52ZM665.08 261.15H650V249.65H660.8C661.236 249.655 661.656 249.488 661.969 249.184C662.282 248.881 662.462 248.466 662.47 248.03C662.47 247.813 662.427 247.598 662.342 247.398C662.258 247.198 662.134 247.018 661.978 246.866C661.822 246.715 661.638 246.597 661.435 246.519C661.233 246.44 661.017 246.403 660.8 246.41H650V237H664.51C664.727 237.007 664.943 236.97 665.145 236.891C665.348 236.813 665.532 236.695 665.688 236.544C665.844 236.392 665.968 236.212 666.052 236.012C666.137 235.812 666.18 235.597 666.18 235.38C666.177 235.163 666.132 234.949 666.047 234.75C665.962 234.551 665.838 234.37 665.683 234.219C665.528 234.068 665.344 233.948 665.143 233.868C664.942 233.787 664.727 233.747 664.51 233.75H648.06C647.839 233.745 647.62 233.784 647.415 233.866C647.21 233.948 647.023 234.071 646.867 234.227C646.711 234.383 646.588 234.569 646.506 234.774C646.424 234.98 646.385 235.199 646.39 235.42V262.69C646.385 262.911 646.424 263.13 646.506 263.336C646.588 263.541 646.711 263.727 646.867 263.883C647.023 264.039 647.21 264.162 647.415 264.244C647.62 264.326 647.839 264.366 648.06 264.36H665.06C665.495 264.363 665.914 264.195 666.226 263.892C666.539 263.589 666.72 263.175 666.73 262.74C666.72 262.311 666.541 261.904 666.232 261.606C665.923 261.309 665.509 261.145 665.08 261.15ZM699.151 233.434C699.375 233.336 699.616 233.284 699.86 233.28C700.105 233.28 700.347 233.329 700.572 233.425C700.797 233.521 701 233.661 701.169 233.838C701.338 234.015 701.47 234.224 701.556 234.453C701.642 234.682 701.681 234.926 701.67 235.17V263.17C701.67 263.637 701.485 264.084 701.155 264.415C700.825 264.745 700.377 264.93 699.91 264.93C699.593 264.907 699.286 264.811 699.012 264.649C698.737 264.488 698.504 264.266 698.33 264L680.89 240.64V263.04C680.898 263.284 680.857 263.527 680.77 263.756C680.683 263.984 680.552 264.193 680.383 264.369C680.215 264.546 680.013 264.688 679.789 264.786C679.565 264.884 679.324 264.936 679.08 264.94C678.835 264.94 678.593 264.891 678.367 264.794C678.142 264.697 677.939 264.556 677.771 264.378C677.602 264.2 677.472 263.99 677.387 263.76C677.303 263.53 677.267 263.285 677.28 263.04V235.04C677.291 234.57 677.485 234.122 677.821 233.793C678.158 233.464 678.61 233.28 679.08 233.28C679.69 233.28 680.15 233.61 680.8 234.49L698.1 257.58L698.05 235.18C698.042 234.936 698.083 234.693 698.17 234.464C698.257 234.236 698.388 234.028 698.557 233.851C698.725 233.674 698.927 233.532 699.151 233.434ZM728.71 236.62C730.512 236.594 732.294 236.992 733.913 237.783C735.532 238.573 736.943 239.733 738.03 241.17C738.21 241.404 738.442 241.593 738.707 241.722C738.973 241.85 739.265 241.915 739.56 241.91C740.002 241.916 740.428 241.748 740.747 241.443C741.067 241.139 741.255 240.721 741.27 240.28C741.229 239.704 740.985 239.162 740.58 238.75C739.122 237.013 737.296 235.621 735.235 234.675C733.174 233.729 730.928 233.253 728.66 233.28C726.55 233.227 724.45 233.597 722.485 234.368C720.52 235.139 718.729 236.295 717.217 237.769C715.706 239.243 714.505 241.004 713.685 242.949C712.865 244.894 712.442 246.984 712.442 249.095C712.442 251.206 712.865 253.296 713.685 255.241C714.505 257.186 715.706 258.947 717.217 260.421C718.729 261.895 720.52 263.051 722.485 263.822C724.45 264.593 726.55 264.963 728.66 264.91C730.93 264.952 733.181 264.483 735.245 263.536C737.308 262.589 739.132 261.189 740.58 259.44C740.985 259.028 741.229 258.486 741.27 257.91C741.255 257.469 741.067 257.051 740.747 256.747C740.428 256.442 740.002 256.275 739.56 256.28C739.262 256.269 738.965 256.329 738.694 256.454C738.423 256.579 738.185 256.766 738 257C736.903 258.425 735.491 259.577 733.873 260.365C732.256 261.153 730.479 261.555 728.68 261.54C725.433 261.448 722.349 260.093 720.085 257.764C717.82 255.434 716.553 252.314 716.553 249.065C716.553 245.816 717.82 242.696 720.085 240.366C722.349 238.037 725.433 236.682 728.68 236.59L728.71 236.62ZM756.16 261.15H771.24C771.668 261.145 772.081 261.309 772.388 261.607C772.695 261.905 772.872 262.312 772.88 262.74C772.872 263.174 772.693 263.588 772.383 263.891C772.072 264.194 771.654 264.363 771.22 264.36H754.22C753.999 264.366 753.779 264.326 753.574 264.244C753.369 264.162 753.183 264.039 753.027 263.883C752.871 263.727 752.748 263.541 752.666 263.336C752.584 263.13 752.544 262.911 752.55 262.69V235.42C752.544 235.199 752.584 234.98 752.666 234.774C752.748 234.569 752.871 234.383 753.027 234.227C753.183 234.071 753.369 233.948 753.574 233.866C753.779 233.784 753.999 233.745 754.22 233.75H770.68C770.896 233.747 771.112 233.787 771.313 233.868C771.514 233.948 771.697 234.068 771.852 234.219C772.008 234.37 772.131 234.551 772.217 234.75C772.302 234.949 772.347 235.163 772.35 235.38C772.35 235.597 772.306 235.812 772.222 236.012C772.137 236.212 772.014 236.392 771.858 236.544C771.702 236.695 771.518 236.813 771.315 236.891C771.113 236.97 770.897 237.007 770.68 237H756.16V246.41H767C767.217 246.403 767.433 246.44 767.635 246.519C767.838 246.597 768.022 246.715 768.178 246.866C768.334 247.018 768.457 247.198 768.542 247.398C768.626 247.598 768.67 247.813 768.67 248.03C768.662 248.466 768.482 248.881 768.169 249.184C767.856 249.488 767.436 249.655 767 249.65H756.16V261.15ZM795.12 247.84L791.74 246.22C787.74 244.32 786.82 243.22 786.82 241.07C786.82 238.38 789 236.62 792.25 236.62C793.42 236.622 794.575 236.876 795.638 237.364C796.701 237.852 797.647 238.564 798.41 239.45C798.568 239.628 798.76 239.773 798.975 239.876C799.189 239.979 799.422 240.038 799.66 240.05C800.097 240.041 800.515 239.871 800.832 239.572C801.15 239.272 801.346 238.865 801.38 238.43C801.366 237.87 801.133 237.339 800.73 236.95C799.672 235.765 798.369 234.823 796.912 234.19C795.456 233.556 793.879 233.246 792.29 233.28C787.01 233.28 783.06 236.67 783.06 241.28C783.06 244.71 785.06 247.17 789.97 249.49L793.4 251.11C797.4 252.96 798.51 254.22 798.51 256.49C798.51 259.49 796.05 261.59 792.34 261.59C790.847 261.568 789.379 261.195 788.057 260.5C786.735 259.805 785.595 258.808 784.73 257.59C784.602 257.39 784.433 257.22 784.235 257.089C784.037 256.958 783.814 256.87 783.58 256.83C783.346 256.79 783.107 256.799 782.876 256.856C782.646 256.914 782.43 257.019 782.243 257.165C782.055 257.31 781.9 257.493 781.788 257.702C781.675 257.911 781.607 258.141 781.588 258.378C781.568 258.614 781.599 258.852 781.677 259.077C781.755 259.301 781.878 259.506 782.04 259.68C783.25 261.284 784.811 262.59 786.603 263.498C788.395 264.406 790.371 264.892 792.38 264.92C798.23 264.92 802.26 261.39 802.26 256.39C802.26 252.71 800.27 250.3 795.12 247.84ZM407.415 239.485C407.742 239.813 407.927 240.257 407.93 240.72C407.925 241.199 407.735 241.657 407.4 242L400.17 249.27L407.4 256.5C407.719 256.853 407.906 257.305 407.93 257.78C407.934 258.014 407.892 258.246 407.806 258.463C407.72 258.681 407.592 258.879 407.43 259.047C407.267 259.216 407.073 259.35 406.859 259.443C406.645 259.536 406.414 259.586 406.18 259.59C405.938 259.582 405.7 259.525 405.481 259.424C405.261 259.323 405.063 259.178 404.9 259L397.67 251.73L390.44 258.96C390.201 259.218 389.889 259.398 389.546 259.474C389.202 259.551 388.844 259.521 388.518 259.388C388.192 259.256 387.914 259.027 387.721 258.733C387.529 258.438 387.431 258.092 387.44 257.74C387.464 257.265 387.652 256.813 387.97 256.46L395.2 249.23L387.97 242C387.635 241.657 387.445 241.199 387.44 240.72C387.446 240.375 387.554 240.039 387.752 239.756C387.949 239.472 388.226 239.254 388.548 239.129C388.869 239.003 389.221 238.976 389.558 239.051C389.895 239.126 390.202 239.3 390.44 239.55L397.67 246.73L404.9 239.55C405.064 239.373 405.262 239.23 405.481 239.131C405.701 239.031 405.939 238.976 406.18 238.97C406.643 238.973 407.087 239.158 407.415 239.485Z"
        />
      </svg>
    </Root>
  );
}
