/* ═══════════════════════════════════════════════════════════════════════
   AI Write — mobile prototype kit

   Shared by the three full prototypes (proto-1 / proto-2 / proto-3), so each
   direction runs on the same composer, keyboard and fake model and the only
   thing that differs between files is the flow itself.

     P.app     state + render loop; one object per prototype
     P.shell   the 402×874 iOS composer (geometry from index.html)
     P.kbd     a working iOS keyboard — your own keyboard types too
     P.ai      a canned writer: prompt + tone + length → subject / body,
               plus "describe your change" → new tone / length / lines
     P.stream  word-by-word reveal after a short think, cancellable

   Icons are the Titan DS "Compose tools" set, inlined from options.html so
   the files stand alone.
   ═══════════════════════════════════════════════════════════════════════ */
var P = (function () {
  var SPRITE = "<svg width=\"0\" height=\"0\" style=\"position:absolute\" aria-hidden=\"true\">\n    <defs>\n      <symbol id=\"i-attachment\" viewBox=\"0 0 24 24\"><g id=\"titan-artwork\" fill=\"none\"><g transform=\"translate(2.646694 2.000000) scale(1.286058)\">\n              <g id=\"Attach\">\n                <path id=\"Vector\" d=\"M14.2692 7.65739C14.1022 7.51539 13.8862 7.44339 13.6672 7.45539C13.4472 7.46739 13.2412 7.56439 13.0912 7.72439C11.5622 9.52939 9.88923 11.2064 8.08823 12.7384C6.17523 14.2284 4.17423 14.2614 2.72823 12.8164C1.28323 11.3714 1.32823 9.33639 2.82823 7.45739C4.34023 5.56839 6.05423 3.85339 7.94423 2.34339C8.40423 1.91739 9.00423 1.67339 9.63023 1.65939C10.2572 1.64539 10.8672 1.86039 11.3462 2.26539C11.7782 2.72839 12.0132 3.34139 12.0012 3.97439C11.9882 4.60739 11.7292 5.21039 11.2802 5.65639C9.89123 7.43139 8.29323 9.03339 6.52023 10.4264C6.18723 10.6594 5.54323 10.9934 5.06423 10.5144C4.89823 10.3014 4.81523 10.0344 4.83223 9.76439C4.84823 9.49439 4.96223 9.23939 5.15323 9.04739C6.32423 7.62239 7.63523 6.31739 9.06723 5.15539C9.23323 5.01139 9.33723 4.80839 9.35723 4.58839C9.37723 4.36939 9.31323 4.15139 9.17823 3.97739C9.03323 3.81139 8.83023 3.70739 8.61123 3.68739C8.39223 3.66739 8.17423 3.73139 8.00023 3.86639C6.46223 5.13239 5.05523 6.54639 3.79723 8.09139C3.36823 8.59839 3.14123 9.24539 3.15723 9.90939C3.17323 10.5734 3.43323 11.2084 3.88623 11.6934C4.36623 12.1554 5.00323 12.4214 5.67023 12.4374C6.33623 12.4544 6.98523 12.2204 7.48823 11.7824C9.38423 10.2904 11.0872 8.56839 12.5582 6.65639C13.2592 5.89639 13.6432 4.89739 13.6302 3.86439C13.6182 2.83039 13.2102 1.84039 12.4912 1.09739C11.7352 0.405391 10.7512 0.0153904 9.72723 0.000390363C8.70223 -0.0136096 7.70723 0.34939 6.93223 1.02039C4.91923 2.61539 3.09223 4.43039 1.48423 6.43439C-0.505771 8.99139 -0.505771 11.9494 1.55123 13.9844C2.02123 14.4744 2.58523 14.8674 3.21023 15.1364C3.83423 15.4064 4.50723 15.5464 5.18723 15.5514C6.62523 15.5064 8.00623 14.9814 9.11223 14.0614C10.9872 12.4584 12.7342 10.7114 14.3372 8.83639C14.4822 8.66939 14.5572 8.45339 14.5442 8.23339C14.5312 8.01339 14.4342 7.80639 14.2702 7.65739H14.2692Z\" fill=\"currentColor\" />\n              </g>\n            </g>\n</g></symbol>\n<symbol id=\"i-ai-write\" viewBox=\"0 0 24 24\"><g id=\"titan-artwork\" transform=\"translate(12 12) scale(0.900000) translate(-12 -12)\" fill=\"none\"><g transform=\"translate(2.000000 2.000000) scale(1.111111)\">\n<g id=\"Group 22736\">\n<path id=\"Subtract\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M9 18C13.9706 18 18 13.9706 18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18ZM7.91652 4L8.19288 4.55271L8.74559 4.6218L8.28463 5.01312L8.46923 5.65814L7.91652 5.29003L7.36381 5.65814L7.54841 5.01312L7.08745 4.6218L7.64016 4.55271L7.91652 4ZM12.3382 9.52712L12.7992 10.4479L13.72 10.5635L12.9523 11.2162L13.259 12.2907L12.3382 11.6766L11.4174 12.2907L11.7242 11.2162L10.9564 10.5635L11.8773 10.4479L12.3382 9.52712ZM5.42931 5.10542L5.79797 5.84219L6.53474 5.93449L5.92068 6.45625L6.16608 7.31627L5.42931 6.82491L4.69255 7.31627L4.93795 6.45625L4.32389 5.93449L5.06066 5.84219L5.42931 5.10542ZM4.32389 12.5195C4.11496 12.3106 4 12.0331 4 11.738C4 11.4428 4.11496 11.1654 4.32389 10.9564L10.7276 4.55271C11.1455 4.13486 11.8728 4.13486 12.2907 4.55271L13.1673 5.42931C13.3762 5.63824 13.4912 5.9157 13.4912 6.21085C13.4912 6.506 13.3762 6.78346 13.1673 6.99238L6.76356 13.3961C6.55464 13.605 6.27717 13.72 5.98203 13.72C5.68688 13.72 5.40942 13.605 5.20049 13.3961L4.32389 12.5195ZM12.3858 6.21085L11.5092 5.33425L9.52712 7.31627L10.4037 8.19288L12.3858 6.21085Z\" fill=\"currentColor\" />\n</g>\n</g>\n</g></symbol>\n<symbol id=\"i-templates\" viewBox=\"0 0 24 24\"><g id=\"titan-artwork\" transform=\"translate(12 12) scale(0.925000) translate(-12 -12)\" fill=\"none\"><g transform=\"translate(-3.000000 -3.000000) scale(1.250000)\">\n<g id=\"Templates\">\n<path id=\"Subtract\" d=\"M17 4C18.1046 4 19 4.89543 19 6V18C19 19.1046 18.1046 20 17 20H7C5.89543 20 5 19.1046 5 18V6C5 4.89543 5.89543 4 7 4H17ZM8.17773 15.5781C7.81875 15.5781 7.52734 15.8695 7.52734 16.2285C7.52755 16.5873 7.81888 16.8779 8.17773 16.8779H15.8242C16.1829 16.8778 16.4734 16.5872 16.4736 16.2285C16.4736 15.8696 16.1831 15.5783 15.8242 15.5781H8.17773ZM8.17773 12.2734C7.81875 12.2734 7.52734 12.5648 7.52734 12.9238C7.52755 13.2826 7.81888 13.5732 8.17773 13.5732H15.8242C16.1829 13.5731 16.4734 13.2825 16.4736 12.9238C16.4736 12.5649 16.1831 12.2736 15.8242 12.2734H8.17773ZM8.52734 6.77344C7.97506 6.77344 7.52734 7.22115 7.52734 7.77344V9.27344C7.52734 9.82572 7.97506 10.2734 8.52734 10.2734H11.791C12.3433 10.2734 12.791 9.82572 12.791 9.27344V7.77344C12.791 7.22115 12.3433 6.77344 11.791 6.77344H8.52734Z\" fill=\"currentColor\" />\n</g>\n</g>\n</g></symbol>\n<symbol id=\"i-track\" viewBox=\"0 0 24 24\"><g id=\"titan-artwork\" fill=\"none\"><g transform=\"translate(2.000000 4.275000) scale(1.111111)\">\n<g id=\"Group\">\n<path id=\"Vector\" d=\"M9.0001 4.5C8.515 4.5 8.0409 4.64384 7.6376 4.91332C7.2343 5.1828 6.91992 5.5658 6.73429 6.014C6.54867 6.4621 6.5001 6.9552 6.59473 7.431C6.68936 7.9067 6.92294 8.3437 7.2659 8.6867C7.6089 9.0297 8.0459 9.2632 8.5216 9.3579C8.9974 9.4525 9.4905 9.4039 9.9386 9.2183C10.3868 9.0327 10.7698 8.7183 11.0393 8.315C11.3088 7.9117 11.4526 7.4376 11.4526 6.9525C11.4496 6.303 11.1903 5.6809 10.731 5.2216C10.2717 4.7623 9.6496 4.50296 9.0001 4.5Z\" fill=\"currentColor\" />\n<path id=\"Vector_2\" d=\"M9 0C3.88125 0 0 4.4325 0 6.9525C0 9.4725 3.88125 13.905 9 13.905C14.1188 13.905 18 9.4725 18 6.9525C18 4.4325 14.1188 0 9 0ZM9 10.8113C8.2368 10.8113 7.4908 10.5849 6.85619 10.1609C6.22162 9.7369 5.72704 9.1343 5.43498 8.4292C5.14292 7.7241 5.0665 6.9482 5.21539 6.1997C5.36428 5.4512 5.7318 4.76361 6.27145 4.22395C6.81111 3.6843 7.4987 3.31679 8.2472 3.16789C8.9957 3.019 9.7716 3.09542 10.4767 3.38748C11.1818 3.67954 11.7844 4.17413 12.2084 4.80869C12.6324 5.4433 12.8588 6.1893 12.8588 6.9525C12.8558 7.975 12.4483 8.9548 11.7253 9.6778C11.0023 10.4008 10.0225 10.8083 9 10.8113Z\" fill=\"currentColor\" />\n</g>\n</g>\n</g></symbol>\n<symbol id=\"i-reminder\" viewBox=\"0 0 24 24\"><g id=\"titan-artwork\" fill=\"none\"><g transform=\"translate(-8.140798 -7.094789) scale(1.230599)\">\n              <g id=\"Icon/Composer/Bottom action/reminder\">\n                <path id=\"Vector\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M12.58 8.24C12.9 8.56 12.9 9.078 12.58 9.397L10.397 11.58C10.077 11.9 9.559 11.9 9.24 11.58C8.92 11.26 8.92 10.742 9.24 10.422L11.422 8.24C11.742 7.92 12.26 7.92 12.58 8.24ZM12.728 11.013C13.805 10.293 15.071 9.91 16.366 9.91C18.102 9.91 19.768 10.6 20.996 11.827C22.224 13.055 22.913 14.721 22.913 16.457C22.913 17.752 22.529 19.018 21.81 20.095C21.09 21.172 20.068 22.011 18.872 22.506C17.675 23.002 16.359 23.131 15.089 22.879C13.819 22.626 12.652 22.003 11.736 21.087C10.821 20.171 10.196 19.005 9.944 17.735C9.692 16.465 9.821 15.148 10.317 13.951C10.812 12.755 11.652 11.733 12.728 11.013ZM16.763 13.911C16.763 13.509 16.43 13.183 16.019 13.183C15.608 13.183 15.275 13.509 15.275 13.911V16.821C15.275 17.223 15.608 17.548 16.019 17.548H19.987C20.397 17.548 20.731 17.223 20.731 16.821C20.731 16.419 20.398 16.093 19.987 16.093H16.763V13.911ZM20.153 9.397C19.833 9.077 19.833 8.559 20.153 8.24C20.472 7.92 20.99 7.92 21.31 8.24L23.492 10.422C23.812 10.742 23.812 11.26 23.492 11.58C23.172 11.9 22.654 11.9 22.335 11.58L20.153 9.397Z\" fill=\"currentColor\" />\n              </g>\n            </g>\n</g></symbol>\n<symbol id=\"i-signature\" viewBox=\"0 0 24 24\"><g id=\"titan-artwork\" transform=\"translate(12 12) scale(1.100000) translate(-12 -12)\" fill=\"none\"><g transform=\"translate(2.000000 5.306434) scale(1.029304)\">\n              <g id=\"Group\">\n                <path id=\"Vector\" d=\"M19.3692 9.71963C19.4272 9.54103 19.4444 9.35173 19.4196 9.16563C19.3948 8.97953 19.3286 8.80133 19.2259 8.64413C19.1232 8.48693 18.9866 8.35483 18.8261 8.25733C18.6656 8.15983 18.4853 8.09963 18.2985 8.08093C17.3116 8.08093 16.8088 9.10513 16.4364 9.76613L16.0733 10.2969C16.0081 10.3713 15.8835 10.5959 15.8423 10.6387C15.7539 10.5006 15.6967 10.3449 15.6747 10.1825C15.5812 9.84243 15.5066 9.49733 15.4513 9.14903C15.4028 8.83543 15.3375 8.52463 15.2557 8.21793C15.1878 8.01343 15.0782 7.82513 14.934 7.66493C14.7898 7.50463 14.6141 7.37593 14.4178 7.28693C14.2241 7.19023 14.0105 7.13983 13.794 7.13983C13.5775 7.13983 13.3639 7.19023 13.1702 7.28693C12.5499 7.69123 11.9616 8.14253 11.4105 8.63693L11.3174 8.72073C9.96083 9.88453 9.43583 10.3757 9.06363 10.4932C8.69133 10.6108 8.46103 10.5373 8.24933 10.4426C7.97383 10.2696 7.73693 10.0416 7.55351 9.77283L7.80493 9.64253C7.99183 9.54583 8.17223 9.43693 8.34493 9.31663C10.207 7.96653 12.0691 5.48063 11.9295 3.23677C11.9057 2.69638 11.7662 2.16738 11.5205 1.68552C11.2747 1.20365 10.9284 0.780138 10.5049 0.443588C10.3426 0.304898 10.1519 0.203238 9.94633 0.145648C9.67333 0.0817783 9.39653 0.0351384 9.11773 0.00598839C8.59283 -0.0238116 8.06763 0.0578481 7.57654 0.245608C7.08548 0.433358 6.63975 0.722948 6.26865 1.09533C4.76032 2.49192 4.08065 5.18273 4.09927 7.22173C4.1369 7.68763 4.20219 8.15083 4.29479 8.60903L3.23338 9.03733C1.29677 9.79143 1.70925 9.69783 1.20647 9.86533C0.86776 9.94183 0.31523 10.3637 0.12921 10.6569C0.04444 10.8109 0 10.9839 0 11.1597C0 11.3355 0.04444 11.5084 0.12921 11.6625C0.26589 11.8852 0.45561 12.0707 0.68144 12.2023C0.90727 12.3339 1.16217 12.4075 1.42338 12.4166C1.59632 12.4411 2.02977 12.2268 2.20271 12.2023C2.20271 12.2023 4.02478 11.4394 5.3562 10.8994C6.09969 11.8882 7.07534 12.5611 7.66235 12.8209C8.24933 13.0806 9.09633 13.0265 9.60013 12.9038C10.1038 12.7812 10.9168 12.4079 12.2205 11.4301C12.3322 11.3463 12.6022 11.0856 12.9002 10.8156L13.1795 10.5642C13.384 11.2282 13.7522 11.8301 14.2502 12.3146C14.755 12.7173 15.3836 12.8449 16.0267 12.9038H16.1291C16.5139 12.9038 16.9017 12.7635 17.2511 12.6124C17.6005 12.4613 17.9978 12.0928 18.2337 11.7941C18.2776 11.7474 18.318 11.6976 18.3548 11.6451C18.8622 10.9999 19.1386 10.5074 19.3692 9.71963ZM9.41563 3.05987C9.41563 4.25163 8.35423 5.85303 7.26488 6.78413L6.8459 7.12863V6.68173C6.86355 5.27203 7.35184 3.90877 8.23323 2.80848C8.29013 2.75001 8.35253 2.69702 8.41943 2.6502C8.58123 2.52037 8.78013 2.44537 8.98733 2.43606C9.03273 2.42114 9.08163 2.42114 9.12703 2.43606C9.22483 2.50632 9.30283 2.60069 9.35343 2.70999C9.40393 2.8193 9.42543 2.93983 9.41563 3.05987Z\" fill=\"currentColor\" />\n              </g>\n            </g>\n</g></symbol>\n<symbol id=\"i-campaign\" viewBox=\"0 0 24 24\"><g id=\"titan-artwork\" fill=\"none\"><g transform=\"translate(1.103825 1.890710) scale(1.049180)\">\n            <g id=\"megaphone-icon-original 8\">\n              <path id=\"Union\" d=\"M7.7712 2.4634C7.96265 2.4144 8.16444 2.42141 8.35225 2.48294C8.54 2.5445 8.70645 2.65828 8.83175 2.81106C11.4809 6.03543 14.7746 6.70206 14.8181 6.71047L17.3689 7.18801C18.1804 7.34094 18.8984 7.80935 19.3649 8.49075C19.8315 9.17228 20.0082 10.0118 19.8571 10.8238C19.7172 11.5649 19.3132 12.2305 18.7204 12.6968C18.1275 13.1631 17.3858 13.3985 16.6325 13.3599L15.3112 16.2398C15.2419 16.3908 15.1376 16.5232 15.0065 16.6255C14.8753 16.7278 14.7209 16.7972 14.5573 16.8277C14.3938 16.858 14.2253 16.8486 14.0661 16.8003C13.907 16.752 13.7614 16.6665 13.6423 16.5503L13.029 15.9517C12.9065 15.8324 12.8149 15.684 12.7634 15.521C12.712 15.3581 12.7015 15.185 12.7331 15.0171L13.153 12.7779C12.0792 12.7026 9.47517 12.7292 6.6794 14.3032C6.46759 14.4239 6.21987 14.4658 5.98018 14.4214C5.83017 14.393 5.68804 14.3319 5.56417 14.2427C5.40277 14.1285 5.27752 13.9701 5.20382 13.7866C5.13017 13.6033 5.11162 13.4026 5.14913 13.2085L7.0085 3.27786C7.04499 3.08367 7.13612 2.9035 7.2712 2.7593C7.4063 2.61521 7.57984 2.51241 7.7712 2.4634ZM3.65401 10.0796C4.0246 9.9477 4.43342 10.1308 4.58175 10.4947C4.73032 10.8586 4.5662 11.275 4.20967 11.44L2.21163 12.3628L2.14425 12.3833C1.76275 12.5178 1.34456 12.3174 1.20967 11.9361C1.07549 11.5549 1.27582 11.137 1.65694 11.0025L3.65401 10.0796ZM1.68135 6.88235L1.68526 6.88137L4.34053 7.36282C4.68293 7.40969 4.94684 7.68828 4.97432 8.03274C5.00181 8.37735 4.78625 8.69373 4.45577 8.79446C4.35609 8.82436 4.25052 8.83332 4.14717 8.81887L1.4919 8.33743C1.09011 8.2852 0.806859 7.91696 0.859089 7.51516C0.91133 7.11339 1.27983 6.83004 1.68135 6.88235ZM2.51046 3.76809C2.75623 3.44422 3.21764 3.381 3.54171 3.62649L5.04561 4.99368C5.35721 5.24989 5.40482 5.70978 5.15206 6.02395C5.06262 6.14274 4.93823 6.231 4.79659 6.27688C4.57162 6.34557 4.32655 6.30119 4.13936 6.15872L2.65108 4.79934C2.32753 4.55337 2.2646 4.09183 2.51046 3.76809Z\" fill=\"currentColor\" />\n            </g>\n          </g>\n</g></symbol>\n<symbol id=\"i-clock\" viewBox=\"0 0 24 24\"><g id=\"titan-artwork\" transform=\"translate(2.000000 2.000000) scale(1.250000)\">\n<g>\n<path d=\"M7.99219 0C12.4161 0.000101211 16 3.58406 16 8C16 12.4159 12.4161 15.9999 7.99219 16C3.57619 16 0 12.416 0 8C0 3.584 3.57619 0 7.99219 0ZM8 1.59961C4.464 1.59961 1.59961 4.464 1.59961 8C1.59961 11.536 4.464 14.4004 8 14.4004C11.536 14.4004 14.4004 11.536 14.4004 8C14.4004 4.464 11.536 1.59961 8 1.59961Z\" fill=\"currentColor\"/>\n<path d=\"M7.824 4H7.776C7.456 4 7.2 4.256 7.2 4.576V8.352C7.2 8.632 7.344 8.896 7.592 9.04L10.912 11.032C11.184 11.192 11.536 11.112 11.696 10.84V10.84C11.864 10.568 11.776 10.208 11.496 10.048L8.4 8.208V4.576C8.4 4.256 8.144 4 7.824 4Z\" fill=\"currentColor\"/>\n</g>\n</g></symbol>\n<symbol id=\"i-close\" viewBox=\"0 0 24 24\"><g id=\"titan-artwork\" fill=\"none\"><g transform=\"translate(3.000000 3.000000) scale(1.697057)\">\n<g id=\"Group 22762\">\n<path id=\"Combined Shape\" d=\"M10.6066 1.41421L9.19239 0L5.3033 3.88909L1.41421 0L0 1.41421L3.88909 5.3033L0 9.19239L1.41421 10.6066L5.3033 6.71751L9.19239 10.6066L10.6066 9.19239L6.71751 5.3033L10.6066 1.41421Z\" fill=\"currentColor\" />\n</g>\n</g>\n</g></symbol>\n<symbol id=\"i-more-vertical\" viewBox=\"0 0 24 24\"><g id=\"titan-artwork\" fill=\"none\"><g transform=\"translate(9.750000 3.000000) scale(1.500000)\">\n<g id=\"Vector\">\n<path d=\"M1.5 3C0.671573 3 0 2.32843 0 1.5C0 0.671573 0.671573 0 1.5 0C2.32843 0 3 0.671573 3 1.5C3 2.32843 2.32843 3 1.5 3Z\" fill=\"currentColor\" />\n<path d=\"M1.5 7.5C0.671573 7.5 0 6.82843 0 6C0 5.17157 0.671573 4.5 1.5 4.5C2.32843 4.5 3 5.17157 3 6C3 6.82843 2.32843 7.5 1.5 7.5Z\" fill=\"currentColor\" />\n<path d=\"M1.5 12C0.671573 12 0 11.3284 0 10.5C0 9.67157 0.671573 9 1.5 9C2.32843 9 3 9.67157 3 10.5C3 11.3284 2.32843 12 1.5 12Z\" fill=\"currentColor\" />\n</g>\n</g>\n</g></symbol>\n<symbol id=\"i-chevron-down\" viewBox=\"0 0 24 24\"><g id=\"titan-artwork\" fill=\"none\"><g fill=\"none\" transform=\"translate(2.000000 6.000000) scale(2.000000)\"><path d=\"m1 1 4 4 4-4\" stroke=\"currentColor\" stroke-width=\"1.5\" /></g>\n</g></symbol>\n      <symbol id=\"i-send-arrow\" viewBox=\"0 0 24 24\">\n        <path d=\"M3.4 20.4 21 12 3.4 3.6 3.39 10.13 15.5 12 3.39 13.87z\" fill=\"currentColor\" />\n      </symbol>\n      <symbol id=\"i-chev-down\" viewBox=\"0 0 24 24\">\n        <path d=\"m6 9 6 6 6-6\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\" stroke-linecap=\"round\"\n          stroke-linejoin=\"round\" />\n      </symbol>\n      <symbol id=\"i-chev-left\" viewBox=\"0 0 24 24\">\n        <path d=\"m14 6-6 6 6 6\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\" stroke-linecap=\"round\"\n          stroke-linejoin=\"round\" />\n      </symbol>\n      <symbol id=\"i-gear\" viewBox=\"0 0 24 24\">\n        <path\n          d=\"M12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7zm7.4-2.6.1-.9-.1-.9 1.9-1.5-1.9-3.3-2.3.9a7 7 0 0 0-1.6-.9L15.2 4H8.8l-.3 2.4a7 7 0 0 0-1.6.9l-2.3-.9-1.9 3.3 1.9 1.5-.1.9.1.9-1.9 1.5 1.9 3.3 2.3-.9c.5.4 1 .7 1.6.9L8.8 20h6.4l.3-2.4c.6-.2 1.1-.5 1.6-.9l2.3.9 1.9-3.3z\"\n          fill=\"currentColor\" />\n      </symbol>\n      <symbol id=\"i-translate\" viewBox=\"0 0 24 24\">\n        <path\n          d=\"M4 4h8v2H9.6c-.3 1.6-1 3-1.9 4.2.6.6 1.2 1.1 1.9 1.5l-.8 1.8c-.9-.5-1.7-1.1-2.4-1.9-.9.9-2 1.6-3.2 2.1L2.4 13c1-.4 1.9-1 2.7-1.7C4.3 10.1 3.7 8.6 3.4 7h2.1c.2 1 .6 2 1.2 2.8.7-.9 1.2-2 1.4-3.2H4V4zm10.5 5h2l3.5 11h-2.1l-.8-2.6h-3.2l-.8 2.6h-2.1L14.5 9zm1 2.6-1.1 3.6h2.2l-1.1-3.6z\"\n          fill=\"currentColor\" />\n      </symbol>\n      <symbol id=\"i-sticker\" viewBox=\"0 0 24 24\"><path d=\"M5 3h14a2 2 0 0 1 2 2v9l-7 7H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm9 17.3 6.3-6.3H16a2 2 0 0 0-2 2v4.3z\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linejoin=\"round\"/><circle cx=\"9\" cy=\"10\" r=\"1.1\" fill=\"currentColor\"/><circle cx=\"14.5\" cy=\"10\" r=\"1.1\" fill=\"currentColor\"/></symbol>\n      <symbol id=\"i-dots\" viewBox=\"0 0 24 24\">\n        <circle cx=\"5\" cy=\"12\" r=\"1.8\" fill=\"currentColor\" />\n        <circle cx=\"12\" cy=\"12\" r=\"1.8\" fill=\"currentColor\" />\n        <circle cx=\"19\" cy=\"12\" r=\"1.8\" fill=\"currentColor\" />\n      </symbol>\n      <symbol id=\"i-mic\" viewBox=\"0 0 24 24\">\n        <path\n          d=\"M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-4 4.9V19h3v2H8v-2h3v-3.1A5 5 0 0 1 7 11h2a3 3 0 0 0 6 0h2z\"\n          fill=\"currentColor\" />\n      </symbol>\n      <symbol id=\"i-emoji\" viewBox=\"0 0 24 24\">\n        <path\n          d=\"M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zM8.5 9a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6zm7 0a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6zM12 17.2c2 0 3.7-1.2 4.4-3H7.6c.7 1.8 2.4 3 4.4 3z\"\n          fill=\"currentColor\" />\n      </symbol>\n      <symbol id=\"i-globe\" viewBox=\"0 0 24 24\">\n        <path\n          d=\"M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm6.9 6h-2.9a15.6 15.6 0 0 0-1.4-3.6A8 8 0 0 1 18.9 8zM12 4.1c.7 1 1.3 2.3 1.7 3.9h-3.4c.4-1.6 1-2.9 1.7-3.9zM4.3 14a8 8 0 0 1 0-4h3.3a16.6 16.6 0 0 0 0 4H4.3zm.8 2h2.9c.3 1.3.8 2.5 1.4 3.6A8 8 0 0 1 5.1 16zm2.9-8H5.1a8 8 0 0 1 4.3-3.6C8.8 5.5 8.3 6.7 8 8zM12 19.9c-.7-1-1.3-2.3-1.7-3.9h3.4c-.4 1.6-1 2.9-1.7 3.9zm2.1-5.9H9.9a14.8 14.8 0 0 1 0-4h4.2a14.8 14.8 0 0 1 0 4zm.5 5.6c.6-1.1 1.1-2.3 1.4-3.6h2.9a8 8 0 0 1-4.3 3.6zm1.8-5.6a16.6 16.6 0 0 0 0-4h3.3a8 8 0 0 1 0 4h-3.3z\"\n          fill=\"currentColor\" />\n      </symbol>\n      <symbol id=\"i-kbd-hide\" viewBox=\"0 0 24 24\">\n        <path\n          d=\"M20 3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-9 3h2v2h-2V6zm0 3h2v2h-2V9zM8 6h2v2H8V6zm0 3h2v2H8V9zM7 11H5V9h2v2zm0-3H5V6h2v2zm9 7H8v-2h8v2zm0-4h-2V9h2v2zm0-3h-2V6h2v2zm3 3h-2V9h2v2zm0-3h-2V6h2v2zM12 23l4-4H8l4 4z\"\n          fill=\"currentColor\" />\n      </symbol>\n      <symbol id=\"i-shift\" viewBox=\"0 0 24 24\">\n        <path d=\"M12 4 4 13h4v5h8v-5h4L12 4z\" fill=\"currentColor\" />\n      </symbol>\n      <symbol id=\"i-del\" viewBox=\"0 0 24 24\">\n        <path\n          d=\"M9 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H9l-7-8 7-8zm3.6 4L11.2 9.4 13.8 12l-2.6 2.6L12.6 16l2.6-2.6 2.6 2.6 1.4-1.4-2.6-2.6 2.6-2.6L17.8 8l-2.6 2.6L12.6 8z\"\n          fill=\"currentColor\" />\n      </symbol>\n      <symbol id=\"i-enter\" viewBox=\"0 0 24 24\">\n        <path d=\"M19 7v4H7.8l3.6-3.6L10 6l-6 6 6 6 1.4-1.4L7.8 13H21V7h-2z\" fill=\"currentColor\" />\n      </symbol>\n      <symbol id=\"i-wifi\" viewBox=\"0 0 20 14\">\n        <path\n          d=\"M10 12.5 12.6 9a4.3 4.3 0 0 0-5.2 0L10 12.5zM10 2c2.7 0 5.2 1 7.1 2.6l-1.4 1.8A9 9 0 0 0 10 4.4a9 9 0 0 0-5.7 2L2.9 4.6A11.2 11.2 0 0 1 10 2zm0 3.6c1.8 0 3.5.6 4.8 1.7l-1.4 1.8A5.5 5.5 0 0 0 10 8a5.5 5.5 0 0 0-3.4 1.1L5.2 7.3A7.7 7.7 0 0 1 10 5.6z\"\n          fill=\"currentColor\" />\n      </symbol>\n      <symbol id=\"i-cellular\" viewBox=\"0 0 18 12\">\n        <rect x=\"0\" y=\"8\" width=\"3\" height=\"4\" rx=\".7\" fill=\"currentColor\" />\n        <rect x=\"5\" y=\"5.5\" width=\"3\" height=\"6.5\" rx=\".7\" fill=\"currentColor\" />\n        <rect x=\"10\" y=\"3\" width=\"3\" height=\"9\" rx=\".7\" fill=\"currentColor\" />\n        <rect x=\"15\" y=\"0\" width=\"3\" height=\"12\" rx=\".7\" fill=\"currentColor\" />\n      </symbol>\n      <symbol id=\"i-battery\" viewBox=\"0 0 27 13\">\n        <rect x=\".5\" y=\".5\" width=\"23\" height=\"12\" rx=\"3.8\" stroke=\"currentColor\" stroke-opacity=\".35\" fill=\"none\" />\n        <rect x=\"2\" y=\"2\" width=\"20\" height=\"9\" rx=\"2.5\" fill=\"currentColor\" />\n        <path d=\"M25 4.6v3.8a2 2 0 0 0 0-3.8z\" fill=\"currentColor\" fill-opacity=\".4\" />\n      </symbol>\n      <symbol id=\"i-and-signal\" viewBox=\"0 0 14 12\">\n        <path d=\"M14 0v12H0L14 0z\" fill=\"currentColor\" />\n      </symbol>\n      <symbol id=\"i-and-battery\" viewBox=\"0 0 9 13\">\n        <path d=\"M3 0h3v1.5h1A1 1 0 0 1 8 2.5v9a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h1V0z\"\n          fill=\"currentColor\" />\n      </symbol>\n          <symbol id=\"i-shorten\" viewBox=\"0 0 24 24\"><path d=\"M4 6h16M4 18h16\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/><path d=\"M10 12H4m16 0h-6m-1.5-2.5L15 12l-2.5 2.5m-1-5L9 12l2.5 2.5\" stroke=\"currentColor\" stroke-width=\"1.8\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></symbol>\n      <symbol id=\"i-lengthen\" viewBox=\"0 0 24 24\"><path d=\"M4 6h16M4 18h16\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/><path d=\"M4 12h6m4 0h6m-4.5-2.5L12 12l2.5 2.5m-5-5L12 12l-2.5 2.5\" stroke=\"currentColor\" stroke-width=\"1.8\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></symbol>\n      <symbol id=\"i-grammar\" viewBox=\"0 0 24 24\"><path d=\"M3 18 8 6l5 12m-8.4-3.6h6.8\" stroke=\"currentColor\" stroke-width=\"1.9\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"m14.5 14.5 2.6 2.6L22 11.4\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></symbol>\n      <symbol id=\"i-tone\" viewBox=\"0 0 24 24\"><path d=\"M12 3a9 9 0 0 1 0 18 9 9 0 0 1 0-18z\" stroke=\"currentColor\" stroke-width=\"1.8\" fill=\"none\"/><path d=\"M12 3a9 9 0 0 1 0 18z\" fill=\"currentColor\"/></symbol>\n      <symbol id=\"i-stop\" viewBox=\"0 0 24 24\"><rect x=\"7\" y=\"7\" width=\"10\" height=\"10\" rx=\"2\" fill=\"currentColor\"/></symbol>\n      <symbol id=\"i-check\" viewBox=\"0 0 24 24\"><path d=\"m5 12.5 4.5 4.5L19 7.5\" stroke=\"currentColor\" stroke-width=\"2.2\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></symbol>\n      <symbol id=\"i-retry\" viewBox=\"0 0 24 24\"><path d=\"M20 12a8 8 0 1 1-2.6-5.9\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\" stroke-linecap=\"round\"/><path d=\"M20 4v5h-5\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></symbol>\n      <symbol id=\"i-send-up\" viewBox=\"0 0 24 24\"><path d=\"M12 19V6m-5.5 5.5L12 6l5.5 5.5\" stroke=\"currentColor\" stroke-width=\"2.2\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></symbol>\n      <symbol id=\"i-undo\" viewBox=\"0 0 24 24\"><path d=\"M9 14 4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11\" stroke=\"currentColor\" stroke-width=\"1.8\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></symbol>\n      <symbol id=\"i-redo\" viewBox=\"0 0 24 24\"><path d=\"m15 14 5-5-5-5M20 9H9.5a5.5 5.5 0 0 0 0 11H13\" stroke=\"currentColor\" stroke-width=\"1.8\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></symbol>\n      <symbol id=\"i-thumb-up\" viewBox=\"0 0 24 24\"><path d=\"M7 10v11M15 5.9 14 10h5.8a2 2 0 0 1 1.9 2.6l-2.3 8a2 2 0 0 1-1.9 1.4H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.8a2 2 0 0 0 1.8-1.1L12 2a3.1 3.1 0 0 1 3 3.9z\" stroke=\"currentColor\" stroke-width=\"1.7\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></symbol>\n      <symbol id=\"i-thumb-down\" viewBox=\"0 0 24 24\"><path d=\"M17 14V3M9 18.1 10 14H4.2a2 2 0 0 1-1.9-2.6l2.3-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.8a2 2 0 0 0-1.8 1.1L12 22a3.1 3.1 0 0 1-3-3.9z\" stroke=\"currentColor\" stroke-width=\"1.7\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></symbol>\n    </defs>\n  </svg>";
  document.body.insertAdjacentHTML('afterbegin', SPRITE);

  function ico(id, cls) {
    if (id === 'i-ai-write') cls = (cls ? cls + ' ' : '') + 'ai-ico';   /* the AI Write mark keeps Titan's purple */
    return '<svg class="icon ' + (cls || '') + '"><use href="#' + id + '"/></svg>';
  }
  function pill(id, label, o) {
    o = o || {};
    return '<button type="button" class="ios-pill ' + (o.cls || '') + '"' + (o.act ? ' data-act="' + o.act + '"' : '') + '>' +
      (id ? ico(id) : '') + label + (o.trail || '') + '</button>';
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function fmt(t) { return esc(t).replace(/\n/g, '<br>'); }
  function cap(s) { return s ? s[0].toUpperCase() + s.slice(1) : s; }
  function lowerFirst(s) { return s && /^[A-Z][a-z]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s; }

  var CARET = '<span class="sw-caret"></span>';
  /* a value as a field shows it: placeholder when empty, caret when focused */
  function text(v, ph, focused) {
    if (!v) return (focused ? CARET : '') + (ph ? '<span class="ph">' + ph + '</span>' : '');
    return fmt(v) + (focused ? CARET : '');
  }

  var BARS = '<div class="gen"><i style="width:40%"></i><i style="width:94%"></i><i style="width:88%"></i>' +
    '<i style="width:96%"></i><i style="width:62%"></i><i style="width:90%"></i><i style="width:74%"></i></div>';

  /* ══════════════ keyboard ═══════════════════════════════════════════ */

  /* The app hands over a target for whatever is focused:
     { get, set, multiline?, enter?, enterLabel?, sugs? } — or null. */
  var kb = { shift: false, target: null, changed: null, escape: null, typed: false, layer: 'abc', pressed: null, keep: false };
  var DICT = ('the to and a about with your you we our for this that team meeting email invite invitation thank thanks ' +
    'next week weekend tomorrow today please update project webinar workshop client clients customer customers discount ' +
    'follow friendly friendlier shorter longer formal casual mention recording add make more less warmer bullet points ' +
    'deadline dinner lunch quarterly report review reminder schedule call proposal offer health fitness design saturday ' +
    'friday monday launch campaign budget feedback interview welcome').split(' ');

  /* ── autocorrect: a frequency-ranked word list (words.js) + iOS-style
     correction on space. Shared with the fake model, which fixes typos in
     prompts and selections the same way. ─────────────────────────────── */
  var RANK = {};
  (typeof WORDS !== 'undefined' ? WORDS : DICT).forEach(function (w, i) { if (!(w in RANK)) RANK[w] = i; });
  DICT.forEach(function (w) { if (!(w in RANK)) RANK[w] = 5000; });
  /* shorthand and apostrophe-less contractions people type on phones */
  var SHORT = { eml: 'email', amail: 'email', emal: 'email', mai: 'mail', emial: 'email', emai: 'email', mial: 'mail', pls: 'please', plz: 'please', thx: 'thanks',
    thnx: 'thanks', tnx: 'thanks', ty: 'thank you', u: 'you', ur: 'your', abt: 'about', msg: 'message', wd: 'would',
    shd: 'should', cud: 'could', reqd: 'required', req: 'request', info: 'info', bcoz: 'because', bcz: 'because', coz: 'because',
    dont: "don't", cant: "can't", wont: "won't", didnt: "didn't", doesnt: "doesn't", isnt: "isn't", wasnt: "wasn't", arent: "aren't",
    couldnt: "couldn't", shouldnt: "shouldn't", wouldnt: "wouldn't", havent: "haven't", hasnt: "hasn't", im: "I'm", ive: "I've",
    ill: null, id: null, youre: "you're", theyre: "they're", thats: "that's", whats: "what's", theres: "there's", lets: null,
    i: 'I', teh: 'the', adn: 'and', tommorow: 'tomorrow', tomorow: 'tomorrow', recieve: 'receive', definately: 'definitely',
    seperate: 'separate', untill: 'until', alot: 'a lot', occured: 'occurred', accomodate: 'accommodate', wich: 'which',
    quotaion: 'quotation', quatation: 'quotation', qoute: 'quote', qoutes: 'quotes', venders: 'vendors', vender: 'vendor',
    diwalli: 'diwali', deewali: 'diwali', divali: 'diwali', regds: 'regards', rgds: 'regards' };
  var AZ = 'abcdefghijklmnopqrstuvwxyz';
  function edits1(w) {
    var out = [];
    for (var i = 0; i <= w.length; i++) {
      var a = w.slice(0, i), b = w.slice(i);
      if (b) out.push(a + b.slice(1));                                   /* delete */
      if (b.length > 1) out.push(a + b[1] + b[0] + b.slice(2));          /* swap */
      for (var j = 0; j < 26; j++) {
        if (b) out.push(a + AZ[j] + b.slice(1));                         /* replace */
        out.push(a + AZ[j] + b);                                         /* insert */
      }
    }
    return out;
  }
  function best(cands) {
    var top = null;
    cands.forEach(function (c) { if (c in RANK && (top === null || RANK[c] < RANK[top])) top = c; });
    return top;
  }
  function keepCase(orig, w) {
    if (orig.length > 1 && orig === orig.toUpperCase()) return w.toUpperCase();
    return orig[0] !== orig[0].toLowerCase() ? cap(w) : w;
  }
  /* the corrected word, or null when it looks fine (deep: also try two edits) */
  var fixCache = {};
  function correct(word, deep) {
    var lo = word.toLowerCase(), key = lo + (deep ? '+' : '');
    if (!/^[a-z]+$/.test(lo)) return null;
    if (key in fixCache) return fixCache[key] === null ? null : keepCase(word, fixCache[key]);
    var r = null;
    if (lo in SHORT) r = SHORT[lo];
    else if (/^(monday|tuesday|wednesday|thursday|friday|saturday|sunday|january|february|april|june|july|august|september|october|november|december|diwali|holi|christmas|navratri|dussehra)$/.test(lo)) r = word[0] === word[0].toLowerCase() ? cap(lo) : null;
    else if (lo.length >= 3 && !(lo in RANK)) {
      var e1 = edits1(lo);
      r = best(e1.filter(function (c) { return c.length >= 3; }));
      if (!r && deep && lo.length >= 6) {
        var seen = {}, e2 = [];
        e1.forEach(function (c) { edits1(c).forEach(function (d) { if (!seen[d] && d.length >= 5) { seen[d] = 1; e2.push(d); } }); });
        r = best(e2);
      }
    }
    else if (lo.length >= 5 && RANK[lo] > 15000) {   /* a rare "word" one letter away from a common one is a typo too */
      var c1 = best(edits1(lo));
      if (c1 && RANK[c1] < 3000) r = c1;
    }
    fixCache[key] = r;
    if (r === null) return null;
    if (r === 'I' || /^I'/.test(r)) return r;
    return keepCase(word, r);
  }
  /* every word in a piece of text; a capitalised word mid-sentence is a name and stays */
  function fixTypos(t) {
    return String(t).replace(/(^|[^A-Za-z'’])([A-Za-z]+)(?![A-Za-z'’])/g, function (m, pre, w, at, all) {
      var startOfSentence = /(^|[.!?]\s*|\n\s*)$/.test(all.slice(0, at + pre.length));
      if (w[0] !== w[0].toLowerCase() && !startOfSentence && w.length > 1) return m;
      var c = correct(w, true);
      return pre + (c || w);
    });
  }

  function target() { return kb.target ? kb.target() : null; }
  function edit(fn) {
    var t = target(); if (!t) return;
    t.set(fn(t.get()));
    kb.typed = true;
    if (kb.changed) kb.changed();
  }
  function insert(s, onScreen) {
    edit(function (v) {
      if (onScreen && /^[a-z]$/.test(s) && (kb.shift || !v || /([.!?]\s|\n)$/.test(v))) s = s.toUpperCase();
      if (onScreen) kb.shift = false;
      /* a word ends: fix it like iOS does (the on-screen keyboard only — pasting / your own keyboard is left alone) */
      if (onScreen && /^[\s.,!?;:]$/.test(s)) {
        var p = partial(v), c = p && !kb.keep ? correct(p, true) : null;
        if (c && c !== p) v = v.slice(0, v.length - p.length) + c;
        /* double space → ". " */
        if (s === ' ' && / $/.test(v) && /[A-Za-z0-9]$/.test(v.slice(0, -1))) return v.slice(0, -1) + '. ';
      }
      kb.keep = false;
      return v + s;
    });
  }
  /* a target with a selection deletes the selection, not the character before it */
  function backspace() {
    var t = target();
    if (t && t.backspace) { t.backspace(); kb.typed = true; if (kb.changed) kb.changed(); return; }
    edit(function (v) { return v.slice(0, -1); });
  }
  function enter() {
    var t = target(); if (!t) return;
    if (t.enter) t.enter(); else if (t.multiline) insert('\n');
  }
  function partial(v) { var m = /[A-Za-z']+$/.exec(v || ''); return m ? m[0] : ''; }
  /* iOS order: what you typed (in quotes) · the correction or best guess · another completion */
  function suggestions(t) {
    if (!t) return ['', '', ''];
    var p = partial(t.get());
    if (!p) return (t.sugs || ['I', 'The', 'We']).slice(0, 3);
    var lo = p.toLowerCase(), out = ['“' + p + '”'], fix = kb.keep ? null : correct(p);
    if (fix && fix !== p) out.push(fix);
    DICT.concat(typeof WORDS !== 'undefined' ? WORDS.slice(0, 3000) : []).forEach(function (w) {
      if (out.length < 3 && w.length > lo.length && w.indexOf(lo) === 0 && out.indexOf(w) < 0) out.push(w);
    });
    while (out.length < 3) out.push('');
    return out;
  }
  function pick(word) {
    edit(function (v) {
      var p = partial(v), w = word.replace(/[“”]/g, '');
      kb.keep = false;
      if (p && p[0] !== p[0].toLowerCase() && w !== 'I' && !/^I'/.test(w)) w = cap(w);
      if (!p && v && !/\s$/.test(v)) v += ' ';
      return v.slice(0, v.length - p.length) + w + ' ';
    });
  }

  function kbd() {
    var t = target(), up = kb.shift, num = kb.layer === '123';
    function key(c) {
      return '<div class="key' + (kb.pressed === c ? ' pr' : '') + '" data-key="' + esc(c) + '">' + esc(up && !num ? c.toUpperCase() : c) + '</div>';
    }
    function row(chars, inset, top) {
      return '<div class="krow" style="left:' + inset + 'px;right:' + inset + 'px;top:' + top + 'px">' + chars.split('').map(key).join('') + '</div>';
    }
    function pr(c) { return kb.pressed === c ? ' pr' : ''; }
    return '<div class="ios-kbd"><div class="ios-acc">' + suggestions(t).map(function (w, i) {
      return (i ? '<div class="sep"></div>' : '') + '<div class="sug"' + (w ? ' data-sug="' + esc(w) + '"' : '') + '>' + esc(w) + '</div>';
    }).join('') + '</div><div class="ios-spacer"></div><div class="ios-layout">' +
      (num ? row('1234567890', 3.06, 0) + row('-/:;()₹&@"', 3.06, 54) + row(".,?!'", 63.44, 108)
        : row('qwertyuiop', 3.06, 0) + row('asdfghjkl', 23.52, 54) + row('zxcvbnm', 63.44, 108)) +
      (num ? '<div class="key sp abs" style="left:3.06px;width:45.02px;top:108px;font-size:15px">#+=</div>'
        : '<div class="key sp abs' + (up ? ' on' : '') + pr('shift') + '" data-key="shift" style="left:3.06px;width:45.02px;top:108px"><svg class="icon" width="20" height="20"><use href="#i-shift"/></svg></div>') +
      '<div class="key sp abs' + pr('del') + '" data-key="del" style="left:353.92px;width:45.02px;top:108px"><svg class="icon" width="22" height="22"><use href="#i-del"/></svg></div>' +
      '<div class="key sp abs' + pr('layer') + '" data-key="layer" style="left:3.06px;width:94.1px;top:162px">' + (num ? 'ABC' : '123') + '</div>' +
      '<div class="key abs space' + pr('space') + '" data-key="space" style="left:103.31px;width:195.38px;top:162px">space</div>' +
      '<div class="key sp abs' + (t && t.enterLabel ? ' go' : '') + pr('enter') + '" data-key="enter" style="left:304.84px;width:94.1px;top:162px">' +
      (t && t.enterLabel || 'return') + '</div></div>' +
      '<div class="ios-emoji"><svg class="icon" width="24" height="24"><use href="#i-emoji"/></svg>' +
      '<svg class="icon" width="20" height="20"><use href="#i-mic"/></svg></div><div class="home-ind"></div></div>';
  }

  /* your own keyboard types into whatever the phone has focused */
  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target && e.target.closest && e.target.closest('.panel')) return;
    if (e.key === 'Escape') { if (kb.escape) kb.escape(); return; }
    if (!target()) return;
    if (e.key === 'Backspace') { e.preventDefault(); backspace(); }
    else if (e.key === 'Enter') { e.preventDefault(); enter(); }
    else if (e.key.length === 1) { e.preventDefault(); insert(e.key); }
  });
  document.addEventListener('paste', function (e) {
    if (!target()) return;
    var s = (e.clipboardData || window.clipboardData).getData('text');
    if (s) { e.preventDefault(); insert(s.replace(/\r/g, '')); }
  });

  /* ══════════════ composer shell ═════════════════════════════════════ */

  /* o: subject, body, focus, bar (html | null), kbd, sheet, scrim, catcher,
     over, toast, bodyHtml, fieldsBottom, padBottom, scrollKey, pin */
  function shell(o) {
    var kbdOn = !!o.kbd, hasBar = o.bar != null;
    var bottom = o.fieldsBottom != null ? o.fieldsBottom : kbdOn ? 336 + (hasBar ? 52 : 0) : (hasBar ? 86 : 0);
    var pin = o.pin ? 'end' : o.focus === 'body' || o.focus === 'subject' ? 'typing' : '';
    return '<div class="phone ios">' +
      '<div class="ios-top">' +
      '<div class="ios-status"><span class="ios-time">9:41</span><span class="ios-statusicons">' +
      '<svg class="icon" width="18" height="12"><use href="#i-cellular"/></svg>' +
      '<svg class="icon" width="17" height="12"><use href="#i-wifi"/></svg>' +
      '<svg class="icon" width="27" height="13"><use href="#i-battery"/></svg></span></div>' +
      '<div class="ios-headrow"><div class="ios-headleft">' +
      '<svg class="icon" width="24" height="24" style="color:#333" data-act="trash"><use href="#i-close"/></svg>' +
      '<div class="ios-from"><span class="lbl">From</span><span class="val">amy@acme.co.in</span></div>' +
      '</div><div class="ios-send" data-act="send">Send</div></div></div>' +
      '<div class="ios-fields" data-scroll="' + (o.scrollKey || 'fields') + '"' + (pin ? ' data-pin="' + pin + '"' : '') +
      ' style="bottom:' + bottom + 'px;padding-bottom:' + (o.padBottom || 24) + 'px">' +
      '<div class="ios-torow"><div class="ios-toleft"><span class="ios-tolbl">To</span>' +
      '<span class="ios-chip">Jim Halpert</span></div>' +
      '<svg class="icon" width="24" height="24" style="color:#888"><use href="#i-chevron-down"/></svg></div>' +
      '<div class="rule"></div>' +
      '<div class="ios-subject" data-act="focus:subject">' + text(o.subject, 'Subject', o.focus === 'subject') + '</div>' +
      '<div class="rule"></div>' +
      '<div class="ios-body" data-act="focus:body">' + (o.bodyHtml != null ? o.bodyHtml : text(o.body, '', o.focus === 'body')) + '</div>' +
      '</div>' +
      (hasBar ? '<div class="ios-toolbar' + (kbdOn ? '' : ' low') + '" style="background:#fff"><div class="bar-scroll">' + o.bar + '</div></div>' : '') +
      (o.scrim ? '<div class="scrim"' + (typeof o.scrim === 'string' ? ' data-act="' + o.scrim + '"' : '') + '></div>' : '') +
      (o.catcher ? '<div class="catch" data-act="' + o.catcher + '"></div>' : '') +
      (o.sheet || '') +
      (kbdOn ? kbd() : o.sheet ? '' : '<div class="home-ind"></div>') +
      (o.over || '') + toastHtml(o.toast) + '</div>';
  }

  var COMPOSE_ROW = function (act) {
    return pill('i-attachment', 'Attach') + pill('i-ai-write', 'AI Write', { cls: 'ai', act: act }) +
      pill('i-templates', 'Templates') + pill('i-track', 'Tracking');
  };

  function toastHtml(t) {
    if (!t) return '';
    /* positions past the middle were laid out on an 874-tall phone: keep their distance from the bottom */
    var top = !t.top ? '' : t.top > 437 ? 'calc(var(--ph, 874px) - ' + (874 - t.top) + 'px)' : t.top + 'px';
    return '<div class="toast"' + (top ? ' style="top:' + top + '"' : '') + '>' + ico('i-check') + esc(t.msg) +
      (t.act ? '<b data-act="' + t.act + '">' + (t.label || 'Undo') + '</b>' : '') + '</div>';
  }

  /* the draft under review — subject, body, and ‹ n / N › once there's more than one */
  function verStepper(v) {
    return v && v.n > 1 ? '<span class="sw-ver">' +
      '<span class="a' + (v.i === 0 ? ' off' : '') + '" data-act="ver:-1">' + ico('i-chev-left') + '</span>' +
      (v.i + 1) + ' / ' + v.n +
      '<span class="a' + (v.i === v.n - 1 ? ' off' : '') + '" data-act="ver:1">' + ico('i-chev-left', 'flip') + '</span></span>' : '';
  }

  function draftCard(o) {
    var ver = verStepper(o.ver);
    var inner = o.text == null ? BARS :
      '<div class="sw-subj"><div><span>Subject</span>' + esc(o.subject || '') + '</div>' + ver + '</div>' + fmt(o.text);
    return '<div class="sw-draft' + (o.shimmer ? ' shimmer' : '') + '" data-scroll="' + (o.key || 'draft') + '"' +
      (o.pin ? ' data-pin="end"' : '') + (o.act ? ' data-act="' + o.act + '"' : '') + '>' + inner + '</div>';
  }

  /* iOS action sheet for leaving with a draft that never reached the email */
  function confirmSheet(discardAct, keepAct, copy) {
    copy = copy || { title: 'Discard this draft?', body: 'It hasn’t been added to your email yet. The draft and your prompt will be lost.', btn: 'Discard draft' };
    return '<div class="scrim top" data-act="' + keepAct + '"></div><div class="confirm">' +
      '<div class="grp"><div class="t"><b>' + copy.title + '</b>' + copy.body + '</div>' +
      '<div class="b red" data-act="' + discardAct + '">' + copy.btn + '</div></div>' +
      '<div class="grp"><div class="b" data-act="' + keepAct + '">Keep reviewing</div></div></div>';
  }

  /* ══════════════ chat dock pieces (options 2 and 3) ═════════════════ */

  /* o: text, ph, focus, count, send (act when ready), busy (stop act), tap, close, off */
  function cField(o) {
    var send = o.busy
      ? '<span class="cx-send" data-act="' + o.busy + '">' + ico('i-stop') + '</span>'
      : '<span class="cx-send' + (o.send ? '' : ' off') + '"' + (o.send ? ' data-act="' + o.send + '"' : '') + '>' + ico('i-send-up') + '</span>';
    return '<div class="cx-row"><div class="cx-field' + (o.focus ? ' focus' : '') + (o.off ? ' off' : '') + '" style="flex:1"' +
      (o.tap && !o.off ? ' data-act="' + o.tap + '"' : '') + '>' +
      (o.busy ? '<span class="cx-spin"></span>' : ico('i-ai-write')) +
      '<span class="cx-text">' + (o.ph ? (o.focus ? CARET : '') + '<span class="ph">' + o.text + '</span>' : fmt(o.text) + (o.focus ? CARET : '')) + '</span>' +
      (o.count ? '<span class="cx-count">' + o.count + '</span>' : '') + send + '</div>' +
      (o.close ? '<span class="cx-x" data-act="' + o.close + '">' + ico('i-close') + '</span>' : '') + '</div>';
  }

  /* a Tone / Length chip; open shows its menu, picking a value fires set:key:value */
  function cChip(key, cur, opts, open, off) {
    var menu = open ? '<div class="cx-menu">' + opts.map(function (t) {
      return '<div class="' + (t === cur ? 'on' : '') + '" data-act="set:' + key + ':' + t + '">' + t + (t === cur ? ico('i-check') : '') + '</div>';
    }).join('') + '</div>' : '';
    return '<span class="cx-chip' + (open ? ' open' : '') + (off ? ' off' : '') + '"' + (off ? '' : ' data-act="menu:' + key + '"') + '>' +
      cur + ico('i-chev-down', open ? 'flip' : '') + menu + '</span>';
  }

  /* 5 or fewer left: the counter turns into the upgrade banner (web logic) */
  function cLeft(n) {
    if (n > 5) return '<div class="cx-meta">' + n + ' suggestions left</div>';
    return '<div class="cx-banner"><span class="up">' + ico('i-send-up') + '</span><span>' +
      (n ? n + ' suggestion' + (n === 1 ? '' : 's') + ' left. ' : 'You’ve used all your suggestions. ') +
      '<b data-act="upgrade">Upgrade to get unlimited suggestions</b></span></div>';
  }

  function dock(inner, kbdUp) {
    return '<div class="cx' + (kbdUp ? ' kb' : '') + '">' + inner + (kbdUp ? '' : '<div class="home-ind"></div>') + '</div>';
  }

  /* ══════════════ the fake model ════════════════════════════════════ */

  /* Each scene is one email the model knows how to write. Tone wraps it
     (greeting, opener, sign-off); Long adds the list and an extra
     paragraph; refine instructions add lines on top. */
  var SCENES = [
    {
      re: /webinar|fitness|health|nutrition/i, subject: 'Free health & fitness webinar next Thursday',
      core: "we're hosting a free health and fitness webinar next Thursday at 5 PM, and I'd love for you to join us.",
      lead: 'In 45 minutes, our coach will cover:',
      points: ['Practical nutrition advice for busy weeks', 'Simple exercise routines that fit around a working day', 'Small habits that keep your energy up through the afternoon'],
      extra: "There'll be time for questions at the end, and everyone who attends gets a short follow-up guide with the routines and a week of meal ideas.",
      ask: "Just reply to this email and I'll send you the link and a calendar invite."
    },
    {
      re: /workshop|offsite|design review/i, subject: 'Design workshop next Saturday',
      core: 'we have our design workshop next Saturday from 2 PM to 4 PM.',
      lead: "Here's the plan for the afternoon:",
      points: ['A quick look at where our current flows fall short', 'Hands-on sketching in small groups', 'Agreeing on the two ideas we take forward'],
      extra: "If you have any work, inspiration or questions you'd like to discuss, bring them along — the more we have on the wall, the better.",
      ask: "Please mark your calendars, and let me know if you can't make it."
    },
    {
      re: /it services|website|social media/i, subject: 'New: website and social media design',
      core: "we're expanding our IT services to include website and social media design.",
      lead: "Here's what's now on offer:",
      points: ['Website design and build, from a single landing page to a full site', 'Social media profiles, templates and launch graphics', 'Ongoing updates from the same team that runs your IT'],
      extra: 'Because we already know your systems, we can move quickly and keep everything consistent with the setup you have today.',
      ask: "Reply to this email if you'd like a short call to see what this could look like for you."
    },
    {
      re: /discount|loyal|appreciation|% off/i, subject: 'A 25% thank-you for being with us',
      core: "as a thank-you for your loyalty, we're offering you 25% off your next order.",
      lead: 'A few details:',
      points: ['The discount applies to everything in the store', "It's valid until the end of next month", "It's applied automatically at checkout — no code needed"],
      extra: 'Customers like you are the reason we keep going, and this is a small way of saying how much we appreciate it.',
      ask: "Take a look whenever you're ready, and reply if there's anything I can help with."
    },
    {
      re: /financ|invest|portfolio|advisory/i, subject: 'Helping you get more from your portfolio',
      core: "we're launching a new financial advisory service to help clients get more from their investment portfolios.",
      lead: "With the service you'll get:",
      points: ['A full review of your current portfolio and risk', 'A clear plan matched to your goals and timeline', 'Quarterly check-ins as markets and your plans change'],
      extra: "Our advisors work with clients at every stage, so whether you're just starting out or rebalancing a mature portfolio, we'll tailor the plan to you.",
      ask: "If you'd like to talk it through, reply with a couple of times that suit you."
    },
    {
      re: /follow(ing)?[ -]?up|check(ing)? in/i, subject: 'Following up',
      core: 'I wanted to follow up on our last conversation.',
      lead: 'To recap where we landed:',
      points: ['What we agreed on', "What's still open", 'Who owns the next step'],
      extra: "If anything has shifted on your side since we spoke, it's no problem — I'd rather adjust the plan now than later.",
      ask: 'Let me know if anything has changed, or if you need anything from me.'
    },
    {
      re: /meet|sync|call\b|catch up|discuss/i, subject: 'Finding time to talk this week',
      core: "I'd like to set up some time this week to go over where things stand.",
      lead: "I'd like us to cover:",
      points: ['Progress since our last conversation', "Anything that's currently blocked", 'Next steps and owners'],
      extra: "Thirty minutes should be plenty, and I'm happy to work around your calendar.",
      ask: "Let me know a couple of slots that work for you and I'll send an invite."
    }
  ];

  var TONE = {
    Professional: { hi: 'Hi {n},', open: ['I wanted to let you know that ', "I'm writing to let you know that ", 'Just a note to say that '], close: 'Best regards,' },
    Casual: { hi: 'Hey {n},', open: ['Quick one — ', 'Heads up — ', 'So, '], close: 'Cheers,' },
    Friendly: { hi: 'Hi {n}!', open: ["Hope you're having a great week! ", 'I hope all is well! ', 'Hope your week is off to a good start! '], close: 'Thanks so much,' }
  };

  var VERB = /^(invite|ask|tell|remind|thank|let|request|share|announce|update|introduce|confirm|apologi[sz]e|welcome|congratulate|schedule|offer|propose|decline|accept|cancel|reschedule|explain|recommend|suggest|inform|notify|check|follow|submit|send|approve|book|arrange|collect|order)\b/i;

  function nameFor(p) { return /\b(team|everyone|all of us|the group)\b/i.test(p) ? 'team' : 'Jim'; }
  function nameRe(name) { return name === 'team' ? /\b(?:my|our|the)\s+team\b/gi : /\bJim(?: Halpert)?\b/g; }

  /* common non-native phrasings, fixed wherever text passes through the model */
  var PHRASES = [[/\brequest(ing|ed|s)? for (quotes?|quotations?|pricing|prices|rates|estimates?|approval|leave|information|details)\b/gi, 'request$1 $2'],
    [/\bdiscuss(ed|ing)? about\b/gi, 'discuss$1'], [/\brevert back\b/gi, 'get back'], [/\breply back\b/gi, 'reply'],
    [/\bdo the needful\b/gi, 'take care of this'], [/\bpre-?pone(d)?\b/gi, 'move$1 earlier'], [/\bkindly\b/gi, 'please'],
    [/\bquotees\b/gi, 'quotes'], [/\ban? (e-?mail|mail) draft\b/gi, 'an email']];
  var CAPW = new RegExp('\\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|january|february|march|april|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|sept|oct|nov|dec)\\b', 'g');
  function phrases(t) {
    PHRASES.forEach(function (p) {
      var one = new RegExp(p[0].source, p[0].flags.replace('g', ''));
      t = t.replace(p[0], function (m) { var r = m.replace(one, p[1]); return m[0] !== m[0].toLowerCase() ? cap(r) : r; });
    });
    return t.replace(CAPW, function (m) { return cap(m); }).replace(/\b(diwali|holi|christmas|navratri|dussehra|onam|pongal|eid)\b/g, function (m) { return cap(m); });
  }

  /* "Can you write me a short email to my team about X" → "X". The wrapper
     words are the request for an email, not what the email is about. */
  var MAILW = '(?:e-?mails?|mails?|messages?|notes?|letters?|repl(?:y|ies)|drafts?)';
  function topic(p) {
    var t = p.trim().replace(/\s+/g, ' ').replace(/[.!?]+$/, '');
    t = t.replace(/^(hi|hey|hello)[,!.]?\s+/i, '');
    for (var i = 0; i < 3; i++) {
      t = t.replace(/^(please\s+|pls\s+)?(can|could|would|will)\s+you\s+(please\s+)?/i, '')
        .replace(/^(please|kindly)\s+/i, '')
        .replace(/^help\s+me\s+(to\s+)?/i, '')
        .replace(/^(give|get|make)\s+me\s+/i, '')
        .replace(new RegExp('^(?:i\\s+(?:need|want|would like|\'d like|have)\\s+(?:you\\s+)?(?:to\\s+)?)?(?:write|draft|compose|create|prepare|make|send|generate|need)?\\s*(?:me\\s+)?(?:an?\\s+|the\\s+)?(?:(?:short|quick|brief|polite|formal|professional|friendly|proper|nice|good|simple|detailed)\\s+)*' + MAILW + '(?:\\s+' + MAILW + ')?\\s*', 'i'), '')
        .replace(/^(?:i\s+(?:need|want)\s+to\s+)?(?:write|draft|compose)\s+/i, '');
    }
    t = t.replace(new RegExp('\\s+(?:as|in|into)\\s+(?:an?\\s+)?' + MAILW + '(?:\\s+(?:draft|format))?$', 'i'), '');
    t = t.replace(/^(to\s+(?:my\s+|the\s+|our\s+|a\s+)?\w+\s+)?(about|regarding|on|for|that|re:?)\s+/i, '');
    return t.trim();
  }

  var OCC = /\b(diwali|deepavali|holi|christmas|new year|eid|navratri|dussehra|onam|pongal|rakhi|festive season|year[- ]end)\b/i;
  var DAY = '(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)';
  var MON = '(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*';
  function titleCase(w) { return w.replace(/\b[a-z]/g, function (c) { return c.toUpperCase(); }); }
  /* the details a prompt carries, wherever they appear in it */
  function slots(p) {
    var o = {}, m;
    if ((m = OCC.exec(p))) o.occasion = titleCase(m[1].toLowerCase());
    m = /\b(?:quotes?|quotations?|pricing|prices?|rates?|estimates?)\s+(?:for|on|of)\s+(?:the\s+|our\s+|some\s+)?(.+?)(?=\s+(?:from|to|by|before|within|asap|for\s+(?:our|the|this))\b|[.,;!?]|$)/i.exec(p) ||
      /\b(?:for|of|order(?:ing)?|buy(?:ing)?|source|sourcing|purchas(?:e|ing))\s+(?:the\s+|our\s+|some\s+)?((?:[\w-]+\s+){0,3}(?:products?|items?|hampers?|gifts?|supplies|materials?|equipment|services?|chairs?|laptops?|furniture|stationery|uniforms?|boxes|sweets|decorations?|lights?|lamps?|diyas?|t-?shirts?|merchandise|goodies))\b/i.exec(p);
    if (m) {
      var it = m[1].replace(/\s+(?:from|to)\s+(?:the\s+|our\s+|a\s+)?(?:vendors?|suppliers?)$/i, '').trim();
      if (OCC.test(it)) it = it.replace(OCC, function (x) { return titleCase(x.toLowerCase()); });
      if (it && !(o.occasion && it.toLowerCase() === o.occasion.toLowerCase()) && it.split(' ').length <= 6) o.items = it;
    }
    if ((m = new RegExp('\\b(?:by|before|until|till|no later than)\\s+((?:this|next)\\s+' + DAY + '|' + DAY + '|tomorrow|tonight|today|(?:the\\s+)?end of (?:the |this |next )?(?:day|week|month)|eod|eow|\\d{1,2}(?:st|nd|rd|th)?(?:\\s+' + MON + ')?|' + MON + '\\s+\\d{1,2}(?:st|nd|rd|th)?)', 'i').exec(p))) o.deadline = m[1].replace(/^eod$/i, 'end of day').replace(/^eow$/i, 'end of the week');
    if ((m = new RegExp('\\b((?:from|between)\\s+\\d{1,2}(?:st|nd|rd|th)?(?:\\s+' + MON + ')?\\s+(?:to|till|until|and|-)\\s+\\d{1,2}(?:st|nd|rd|th)?(?:\\s+' + MON + ')?|(?:on\\s+)?(?:this|next)\\s+(?:week|month|' + DAY + ')|(?:on\\s+)' + DAY + '|tomorrow|today|on\\s+\\d{1,2}(?:st|nd|rd|th)?(?:\\s+' + MON + ')?)\\b', 'i').exec(p))) o.when = m[1];
    if ((m = /\b(\d+)\s*(units?|pieces?|pcs|boxes|hampers|nos|sets|kgs?|packs?|people|guests)\b/i.exec(p))) o.qty = m[1] + ' ' + m[2];
    if ((m = /\b(vendors?|suppliers?|clients?|customers?|manager|hr|candidates?|partners?)\b/i.exec(p))) o.who = m[1].toLowerCase();
    if ((m = /\binvoice\s*(?:no\.?|number|#)?\s*([A-Z]*-?\d[\w-]*)/i.exec(p))) o.invoice = m[1];
    return o;
  }
  /* what's left after a keyword: "thank Jim for the quick turnaround" → "the quick turnaround" */
  function after(p, re) {
    var m = re.exec(p);
    if (!m) return '';
    return p.slice(m.index + m[0].length).replace(/^\s*(?:for|about|on|regarding|with|to)\s+/i, '')
      .replace(new RegExp('\\s+(?:as|in)\\s+(?:an?\\s+)?' + MAILW + '.*$', 'i'), '').replace(/[.!?]+$/, '').trim();
  }

  /* Intents the model recognises in any wording, filled from the prompt's
     own details. They come before the demo scenes so "a discount on the quote"
     is still a quote request. */
  var INTENTS = [
    { re: /\b(quotes?|quotations?|pricing|price list|rate card|rates for|estimates?|rfq)\b/i, make: function (sl) {
      var items = sl.items || (sl.occasion ? sl.occasion + ' supplies' : 'your products');
      var occ = sl.occasion && !new RegExp(sl.occasion, 'i').test(items) ? ' for ' + sl.occasion : '';
      return {
        subject: 'Request for quotation' + (sl.items ? ' – ' + cap(sl.items) : sl.occasion ? ' – ' + sl.occasion + ' order' : ''),
        core: "we're planning to source " + items + occ + (sl.qty ? ' (around ' + sl.qty + ')' : '') + ", and I'd like to request a quotation from you.",
        lead: 'Could you please include:', always: true,
        points: ['Unit prices' + (sl.qty ? ' for ' + sl.qty : '') + ', including any bulk or festive discounts', 'Delivery timelines' + (sl.occasion ? ' — we need everything well before ' + sl.occasion : ''),
          'Payment terms and how long the quote is valid', 'Minimum order quantities and current stock'],
        extra: "If you have a catalogue or samples, please share those too — it'll help us decide quickly.",
        ask: 'It would be great to have your quote by ' + (sl.deadline || 'the end of this week') + '.'
      };
    } },
    { re: /\b(sick|unwell|not feeling well|fever)\b/i, make: function (sl) {
      return { subject: 'Sick leave' + (sl.when ? ' – ' + sl.when.replace(/^on\s+/i, '') : ' today'),
        core: "I'm not feeling well and won't be able to work " + (sl.when || 'today') + '.',
        lead: 'To keep things moving:', points: ["Nothing urgent is blocked on me", "I'll check messages if anything critical comes up", "I'll update you on when I'm back"],
        extra: "I'll catch up on anything I miss as soon as I'm back.", ask: 'Thanks for understanding.' };
    } },
    { re: /\b(leave|day off|days off|time off|vacation|wfh|work from home|working from home)\b/i, make: function (sl, p) {
      var wfh = /\b(wfh|work(ing)? from home)\b/i.test(p);
      var reason = sl.occasion ? ' for ' + sl.occasion : '';
      return { subject: (wfh ? 'Working from home' : 'Leave request') + (sl.when ? ' – ' + sl.when.replace(/^(on|from|between)\s+/i, '') : reason ? ' –' + reason.replace(' for', '') : ''),
        core: wfh ? "I'd like to work from home " + (sl.when || 'tomorrow') + reason + '.' : "I'd like to request leave " + (sl.when || 'for a few days') + reason + '.',
        lead: 'Before then:', points: ["I'll wrap up or hand over anything urgent", "My calendar and status will be up to date", "I'll be reachable on phone for emergencies"],
        extra: "I'll make sure nothing is blocked while I'm away.", ask: 'Please let me know if that works.' };
    } },
    { re: /\b(payment|invoice|overdue|outstanding|dues|pending amount)\b/i, make: function (sl) {
      var inv = sl.invoice ? ' for invoice ' + sl.invoice : ' on our latest invoice';
      return { subject: 'Payment reminder' + (sl.invoice ? ' – Invoice ' + sl.invoice : ''),
        core: 'this is a gentle reminder that the payment' + inv + ' is now due.',
        lead: 'For quick reference:', points: ['The invoice copy is attached with the amount and due date', 'Payment can be made by bank transfer or UPI', 'Please share the transaction reference once paid'],
        extra: "If the payment is already on its way, please ignore this note — and thank you.",
        ask: 'Could you confirm when we can expect it' + (sl.deadline ? ', ideally by ' + sl.deadline : '') + '?' };
    } },
    { re: /\b(sorry|apolog\w*|delay(ed|s)?|running late)\b/i, make: function (sl, p) {
      var what = after(p, /\b(?:sorry|apolog\w*)\b/i).replace(/^(for|about)\s+/i, '').replace(/^(?:the\s+)?delay(?:ed)?\s*(?:in|on|with)?\s*/i, '');
      var delay = /delay|late/i.test(p);
      return { subject: delay ? 'Apologies for the delay' + (what ? ' in ' + what.split(' ').slice(0, 5).join(' ') : '') : 'My apologies',
        core: "I'm sorry " + (delay ? 'for the delay' + (what ? ' in ' + what : '') : what ? 'about ' + what : 'for the trouble') + '.',
        lead: 'A quick update:', points: ['What caused it', 'Where things stand now', 'The new timeline'],
        extra: "I understand this affects your plans, and I'm putting steps in place so it doesn't happen again.",
        ask: "I'll keep you posted — let me know if there's anything I can do in the meantime." };
    } },
    { re: /\b(thank(s| you)?|grateful|appreciat\w+)\b/i, make: function (sl, p) {
      var what = after(p, /\b(?:thank(?:s| you)?|grateful|appreciat\w+)\b(?:\s+(?:you|him|her|them|jim|the team|everyone))?/i);
      return { subject: 'Thank you' + (what ? ' for ' + what.split(' ').slice(0, 6).join(' ') : ''),
        core: 'I wanted to say a big thank you' + (what ? ' for ' + what : '') + '.',
        extra: "It made a real difference, and it hasn't gone unnoticed.", ask: 'Thanks again — I really appreciate it.' };
    } },
    { re: /\bintroduc\w*\b/i, make: function (sl, p) {
      var who = after(p, /\bintroduc\w*\b/i).replace(/^(me|myself)\b\s*/i, '') || 'myself';
      var self = /^myself$/i.test(who);
      return { subject: self ? 'Introduction' : 'Introducing ' + who.split(' ').slice(0, 5).join(' '),
        core: self ? "I'd like to introduce myself — I'm Amy from Acme, and I'll be your point of contact going forward." : "I'd like to introduce you to " + who + '.',
        extra: self ? "I'm looking forward to working together." : "I think you'll have a lot to talk about, and I'll let you both take it from here.",
        ask: self ? 'Let me know a good time for a quick call.' : 'Feel free to reply all to set up a time.' };
    } },
    { re: /\b(complain\w*|damaged|defective|broken|not working|refund|wrong item|poor quality|faulty)\b/i, make: function (sl) {
      var it = sl.items || 'my recent order';
      return { subject: 'Issue with ' + it,
        core: "I'm writing about a problem with " + it + '.',
        lead: 'Details:', points: ['What was ordered and when', "What's wrong with it", 'Photos are attached'],
        extra: "I'd appreciate a quick resolution, as this affects our plans" + (sl.occasion ? ' for ' + sl.occasion : '') + '.',
        ask: 'Could you let me know the next steps — a replacement or a refund' + (sl.deadline ? ' by ' + sl.deadline : '') + '?' };
    } },
    { re: /\b(place (?:an |the )?order|purchase order|\bpo\b|confirm (?:the |our |my )?order)\b/i, make: function (sl) {
      var it = sl.items || 'the items we discussed';
      return { subject: 'Order confirmation' + (sl.items ? ' – ' + cap(sl.items) : ''),
        core: "I'd like to confirm our order for " + it + (sl.qty ? ' (' + sl.qty + ')' : '') + '.',
        lead: 'Please confirm:', points: ['Final pricing as per your quote', 'Delivery date' + (sl.deadline ? ' (we need it by ' + sl.deadline + ')' : ''), 'Invoice details for processing'],
        extra: 'The purchase order is attached for your records.', ask: 'Let me know once the order is processed.' };
    } },
    { re: /\b(celebration|party|get[- ]together|potluck|team lunch|team dinner|puja|pooja)\b/i, make: function (sl, p) {
      var m = /\b((?:[\w-]+\s+){0,2}(?:celebration|party|get[- ]together|potluck|lunch|dinner|puja|pooja))\b/i.exec(p);
      var ev = m ? m[1].replace(/^(a|an|the|our|for|to)\s+/i, '').replace(OCC, function (x) { return titleCase(x.toLowerCase()); }) : 'celebration';
      return { subject: 'You’re invited: ' + cap(ev) + (sl.when ? ' ' + sl.when : ''),
        core: "we're having a " + ev + (sl.when ? ' ' + sl.when : '') + ", and I'd love for you to join us.",
        lead: 'What to expect:', points: ['Food, sweets and good company', 'A short break from the usual week', 'Time to catch up with everyone'],
        extra: 'Feel free to bring along anything you\'d like to share.', ask: 'Let me know if you can make it' + (sl.deadline ? ' by ' + sl.deadline : '') + '.' };
    } }
  ];

  /* "requesting X" → "request X" (for "I'm writing to …") */
  function baseVerb(w) {
    var lo = w.toLowerCase(), b = lo.replace(/ing$/, '');
    if (b === lo) return null;
    if (/(.)\1$/.test(b) && !(b in RANK)) b = b.slice(0, -1);
    if (b + 'e' in RANK && !(b in RANK)) return b + 'e';
    return b in RANK ? b : b + 'e' in RANK ? b + 'e' : null;
  }

  function scene(p, name, ctx) {
    var sl = slots(p), cs = ctx ? slots(ctx) : {}, both = ctx ? p + ' — ' + ctx : p;
    for (var k in cs) if (!(k in sl)) sl[k] = cs[k];       /* the note fills in what the prompt left out */
    for (var j = 0; j < INTENTS.length; j++) if (INTENTS[j].re.test(both)) { var o = INTENTS[j].make(sl, p); o.intent = true; return o; }
    for (var i = 0; i < SCENES.length; i++) if (SCENES[i].re.test(both)) return SCENES[i];
    var t = topic(p) || 'a quick update';
    var you = t.replace(nameRe(name), 'you').replace(/\b(him|her|them)\b/gi, 'you');
    you = you.replace(/^(tell|inform|notify|let)\s+(you|everyone|all)\s+(know\s+)?(that\s+)?/i, 'let you know that ');
    var first = (you.split(' ')[0] || ''), core, bv = baseVerb(first);
    if (/^let you know that /.test(you)) core = 'I wanted to ' + you + '.';
    else if (/^(i|we)\s+(need|want|would like|'d like)\s+/i.test(you)) core = you.replace(/^(i|we)\s+(need|want)\s+/i, function (m, who) { return (who.toLowerCase() === 'i' ? "I'm" : "we're") + ' looking for '; }) + '.';
    else if (/^(i|we)\b/i.test(you)) core = you.replace(/^i\b/, 'I') + '.';
    else if (bv && first.length > 4) core = "I'm writing to " + bv + you.slice(first.length) + '.';
    else if (VERB.test(you)) core = 'I wanted to ' + lowerFirst(you) + '.';
    else core = 'I wanted to reach out about ' + lowerFirst(you) + '.';
    var subj = t.replace(nameRe(name), '').replace(/^(i|we)\s+(need|want|would like|'d like)\s+(to\s+)?/i, '')
      .replace(/^(ask|tell|let|remind|inform|notify)\s+((you|him|her|them|everyone|all)\s+)?(know\s+)?(about|that|to)?\s*/i, '')
      .replace(/\s+/g, ' ').trim().split(' ').slice(0, 7).join(' ');
    while (/\s(to|with|for|from|about|and|of|the|a|on|in|at|by|is|will|be)$/i.test(subj)) subj = subj.replace(/\s+\S+$/, '');
    if (bv && subj.indexOf(first) === 0) subj = subj.slice(first.length).trim();
    return {
      subject: cap(subj || 'Quick note'),
      core: core,
      extra: "I've kept this brief, but I'm happy to share more detail or jump on a quick call if that's easier.",
      ask: 'Let me know what you think when you get a chance.'
    };
  }

  /* text already in the email that's really a note-to-self ("Vendor quotes"):
     AI Write uses it as context and writes the email in its place */
  function isNote(t) {
    t = (t || '').trim();
    return !!t && t.split(/\s+/).length <= 12 && !/\n/.test(t) && !/^(hi|hello|hey|dear)\b/i.test(t);
  }

  function params(prompt, tone, len, context) {
    return { prompt: prompt, tone: tone || 'Professional', len: len || 'Short', variant: 0, adds: [], bullets: false, context: context || '' };
  }

  function compose(q) {
    /* typos and stray phrasing are fixed before the prompt is read; a note already in the email adds context */
    var p = phrases(fixTypos(q.prompt)).replace(new RegExp('\\s+(?:as|in|into)\\s+(?:an?\\s+)?' + MAILW + '(?:\\s+(?:draft|format))?\\b', 'gi'), '');
    var ctx = q.context ? phrases(fixTypos(q.context)) : '';
    var name = nameFor(p), s = scene(p, name, ctx), T = TONE[q.tone] || TONE.Professional;
    var op = T.open[q.variant % T.open.length], first;
    if (/that $/.test(op) && (/^I[ ']/.test(s.core) || s.intent)) first = cap(s.core);
    else if (/[!.] $/.test(op)) first = op + cap(s.core);
    else first = op + s.core;
    var paras = [T.hi.replace('{n}', name), first];
    if (s.points && (q.len === 'Long' || q.bullets || s.always)) {
      var pts = q.len === 'Long' || q.bullets ? s.points : s.points.slice(0, 3);
      paras.push(s.lead + '\n' + pts.map(function (b) { return '•  ' + b; }).join('\n'));
    }
    if (q.len === 'Long') paras.push(s.extra);
    paras = paras.concat(q.adds);
    paras.push(s.ask, T.close + '\nAmy');
    return { subject: s.subject, text: paras.join('\n\n').replace(/([.!?])\./g, '$1') };
  }

  /* "Describe your change" → new params. Anything it can't read is
     treated as "try another way" so a send always produces a new version. */
  function refine(q, ask) {
    ask = phrases(fixTypos(ask));
    var n = { prompt: q.prompt, tone: q.tone, len: q.len, variant: q.variant, adds: q.adds.slice(), bullets: q.bullets, context: q.context };
    /* a request for a different email altogether starts over from that prompt */
    if (/\b(instead|rather|actually)\b/i.test(ask) && /\b(write|draft|email|mail)\b/i.test(ask)) { n.prompt = ask; n.adds = []; return n; }
    var a = ask.toLowerCase(), hit = false, lines = 0;
    function add(line) { if (n.adds.indexOf(line) < 0) n.adds.push(line); hit = true; lines++; }
    if (/friendl|warm|nicer|kind|enthusias/.test(a)) { n.tone = 'Friendly'; hit = true; }
    else if (/casual|relax|informal|chill/.test(a)) { n.tone = 'Casual'; hit = true; }
    else if (/formal|professional|polite/.test(a)) { n.tone = 'Professional'; hit = true; }
    if (/short|concise|brief|trim|tight|cut/.test(a)) { n.len = 'Short'; n.bullets = false; hit = true; }
    else if (/long|detail|expand|elaborat/.test(a)) { n.len = 'Long'; hit = true; }
    if (/bullet|list/.test(a)) { n.bullets = true; hit = true; }
    if (/record/.test(a)) add("Can't make it live? No problem — everyone who signs up gets the recording.");
    if (/deadline|urgent|asap|by (mon|tue|wed|thu|fri)/.test(a)) add('It would be great to hear back by Friday so we can plan around it.');
    if (/thank/.test(a)) add('Thanks again — I really appreciate it.');
    var m = /\b(?:mention|add|include|say|note)\s+(?:that\s+)?(.+)$/i.exec(ask);
    /* a free-form "mention X" only when none of the known lines above covered it */
    if (m && !lines) {
      var line = m[1].replace(/^(a\s+)?(line|sentence|note|bit)\s+(about|on|saying)\s+/i, '').replace(/[.!]+$/, '');
      add('One more thing — ' + line + '.');
    }
    if (!hit) n.variant++;
    return n;
  }

  /* ── AI Refine: rewriting a selection, not writing an email ───────── */

  /* Rule-based edits on whatever text the user selected. Each op is a list
     of [pattern, replacement]; a match that started with a capital keeps it. */
  function swap(t, pairs) {
    pairs.forEach(function (p) {
      t = t.replace(p[0], function (m) { return m[0] !== m[0].toLowerCase() ? cap(p[1]) : p[1]; });
    });
    return t;
  }
  function fixCaps(t) {
    return t.replace(/([^•\s])[ \t]{2,}/g, '$1 ').replace(/(^|[.!?]\s+|\n\s*)([a-z])/g, function (m, a, b) { return a + b.toUpperCase(); }).trim();
  }
  function words(t) { return t.split(/\s+/).filter(Boolean).length; }

  var CONTRACT = [[/\bI am\b/g, "I'm"], [/\bwe are\b/gi, "we're"], [/\byou are\b/gi, "you're"], [/\bit is\b/gi, "it's"],
    [/\bthat is\b/gi, "that's"], [/\bdo not\b/gi, "don't"], [/\bdoes not\b/gi, "doesn't"], [/\bcannot\b/gi, "can't"],
    [/\bwill not\b/gi, "won't"], [/\bI would\b/g, "I'd"], [/\bI will\b/g, "I'll"], [/\bwe will\b/gi, "we'll"],
    [/\bI have\b/g, "I've"], [/\bthere is\b/gi, "there's"]];
  var EXPAND = CONTRACT.map(function (p) {
    var short = p[1], long = p[0].source.replace(/\\b/g, '');
    return [new RegExp('\\b' + short.replace("'", "['’]") + '\\b', 'gi'), long];
  });
  var FILLER = [
    [/\bI hope (this|the|my) (email|message|note) finds you well[.!]?\s*/gi, ''],
    [/\bI hope you(?:'re| are) (?:doing )?well[.!]?\s*/gi, ''],
    [/\b(I wanted to let you know that|I'?m writing to let you know that|I am writing to let you know that|Just a note to say that) /gi, ''],
    [/\bI(?: am|'m) writing to provide an /gi, "Here's an "], [/\bI(?: am|'m) writing to provide a /gi, "Here's a "],
    [/\bI(?: am|'m) writing to /gi, "I'd like to "], [/\band outline what\b/gi, 'and what'],
    [/\b(really|very|just|actually|quite|basically|definitely) /gi, ''], [/\bin order to\b/gi, 'to'],
    [/\bat this point in time\b/gi, 'now'], [/\bover the coming week\b/gi, 'this week'],
    [/\bplease make sure to\b/gi, 'please'], [/\bThis will be a great opportunity for us to\b/gi, "It's a chance to"],
    [/\bfeel free to /gi, '']];
  var ELAB = ["I'll share more detail as things firm up.", "Happy to walk through any of it if that's useful.",
    "Let me know if you'd like more background on any part of this.", 'It should give everyone a clear picture of what comes next.'];

  function shorten(t) {
    if (/\n•/.test(t)) {          /* a list keeps its lead-in and first two points */
      var n = 0;
      t = t.split('\n').filter(function (l) { return !/^•/.test(l) || n++ < 2; }).join('\n');
    }
    var s = swap(swap(t, FILLER), CONTRACT), parts = s.match(/[^.!?]+[.!?]+(\s+|$)/g);
    if (words(s) > 18 && parts && parts.length > 1 && words(parts.slice(0, -1).join('')) >= 8) s = parts.slice(0, -1).join('');
    else if (words(s) >= words(t) - 1) {
      var i = s.search(/,\s+(and|but|so)\s+|\s+—\s+/);
      if (i > 20) s = s.slice(0, i) + '.';
    }
    return s;
  }
  /* a follow-up sentence that fits what the text is about */
  function elab(t, v) {
    if (/\bquot|pric|rates?\b|estimate/i.test(t)) return ['Could you share your best pricing, available quantities and delivery timelines?', 'Please include unit prices, delivery dates and payment terms.'][v % 2];
    if (/\bmeet|call|sync|discuss/i.test(t)) return ['Could we find 30 minutes this week to go over it?', "I'm flexible on timing — just suggest a slot."][v % 2];
    if (/\bleave|off\b|vacation/i.test(t)) return ["I'll make sure everything is handed over before then.", "I'll stay reachable for anything urgent."][v % 2];
    if (/\bpay|invoice|due\b/i.test(t)) return ['Please let me know once it has been processed.', 'Do share the transaction reference once paid.'][v % 2];
    return ELAB[v % ELAB.length];
  }
  /* "Requesting quotes" → "I'm writing to request quotes." — a fragment becomes a sentence */
  function sentence(t) {
    var w = t.split(' ')[0], bv = baseVerb(w);
    if (bv && w.length > 4) return "I'm writing to " + bv + t.slice(w.length) + '.';
    if (/^(i|we)\b/i.test(t)) return cap(t) + '.';
    if (VERB.test(t)) return 'I wanted to ' + lowerFirst(t) + '.';
    return 'This is about ' + lowerFirst(t) + '.';
  }
  function isFragment(t) { return !/[.!?]["”']?$/.test(t.trim()) && words(t) <= 10 && !/\n/.test(t); }
  function lengthen(t, v) {
    if (/\n•/.test(t)) return t + '\n•  ' + ["Anything else you'd like us to cover", 'Time for questions at the end', 'A short recap afterwards'][v % 3];
    if (isFragment(t)) return sentence(t) + ' ' + elab(t, v);
    var s = swap(t, [[/\bthis week\b/gi, 'over the coming week'], [/\bquick\b/gi, 'short']]);
    return (/[.!?]$/.test(s) ? s : s + '.') + ' ' + elab(t, v);
  }
  /* word swaps per op — applied on top of the phrase rules, so short
     sentences and lists still visibly change */
  var FORMAL_SYN = [[/\bJust reply\b/g, 'Please reply'], [/\breply to\b/gi, 'respond to'], [/\bsend you\b/gi, 'provide you with'],
    [/\bmake it\b/gi, 'attend'], [/\bthink\b/gi, 'believe'], [/\bwill cover\b/gi, 'will address'],
    [/\bget\b/gi, 'receive'], [/\bhelp\b/gi, 'assist'], [/\bneed\b/gi, 'require'], [/\bbusy weeks\b/gi, 'demanding weeks'],
    [/\bbusy\b/gi, 'fully committed'], [/\bquick\b/gi, 'brief'], [/\bfocus on\b/gi, 'prioritise']];
  var CASUAL_SYN = [[/\brespond to\b/gi, 'reply to'], [/\battend\b/gi, 'make it'], [/\bprovide\b/gi, 'give'], [/\breceive\b/gi, 'get'],
    [/\bwill cover\b/gi, 'will go over'], [/\bJust reply\b/g, 'Just hit reply'],
    [/\bPractical\b/g, 'Real-world'], [/\bSimple\b/g, 'Easy'], [/\bSmall\b/g, 'Little']];
  var FRIENDLY_SYN = [[/\bwill cover\b/gi, 'will walk you through'], [/\bJust reply\b/g, 'Just hit reply'],
    [/\bI'll send you\b/gi, "I'll happily send you"], [/\bbusy\b/gi, 'swamped'], [/\bPractical\b/g, 'Friendly, practical'],
    [/\bupdate\b/gi, 'catch-up'], [/\bour team\b/gi, 'the team']];
  var IMPROVE_SYN = [[/\bprovide a quick update on\b/gi, 'share a quick update on'], [/\boutline\b/gi, 'walk through'],
    [/\bgreat opportunity\b/gi, 'great chance'], [/\bmake sure to\b/gi, ''], [/\butilize\b/gi, 'use'], [/\bin regards to\b/gi, 'about'],
    [/\bwe have our\b/gi, "we've got our"], [/\bJust reply\b/g, 'Simply reply'], [/\bwill cover\b/gi, 'will walk through'],
    [/\bfit around\b/gi, 'fit easily around'], [/\bkeep your energy up\b/gi, 'keep your energy high'], [/\bthink\b/gi, 'believe'],
    [/\bmake it\b/gi, 'attend'], [/\bbusy\b/gi, 'stretched']];
  var TYPOS = [[/\bdont\b/gi, "don't"], [/\bim\b/gi, "I'm"], [/\bteh\b/gi, 'the'], [/\brecieve\b/gi, 'receive'],
    [/\balot\b/gi, 'a lot'], [/\bthier\b/gi, 'their'], [/\bwont\b/gi, "won't"], [/\bcant\b/gi, "can't"],
    [/\bdefinately\b/gi, 'definitely'], [/\bseperate\b/gi, 'separate'], [/\buntill\b/gi, 'until'], [/\byour welcome\b/gi, "you're welcome"]];

  function formal(t) {
    return swap(t, [[/\bHey\b/g, 'Hi'], [/\b(Quick one|Heads up|Quick heads up) — /gi, ''], [/^So, /i, ''],
      [/\bThanks so much\b/gi, 'Thank you'], [/\bthanks\b/gi, 'thank you'], [/\bCheers\b/g, 'Best regards'],
      [/\bgonna\b/gi, 'going to'], [/\bkind of\b/gi, 'somewhat'], [/\ba lot of\b/gi, 'many'], [/\bGreat news — /gi, '']
    ].concat(FORMAL_SYN, EXPAND)).replace(/!/g, '.');
  }
  function casual(t) {
    return swap(t, [[/\b(I wanted to let you know that|I'?m writing to let you know that|Just a note to say that) /gi, 'Quick heads up — '],
      [/\bI would like to\b/gi, "I'd love to"], [/\bregarding\b/gi, 'about'], [/\bThank you\b/gi, 'Thanks'],
      [/\bBest regards\b/gi, 'Cheers'], [/\bHi\b/g, 'Hey'], [/\bplease\s+/gi, ''], [/\bassist\b/gi, 'help'],
      [/\bhowever\b/gi, 'but']].concat(CASUAL_SYN, CONTRACT));
  }
  function friendly(t) {
    return swap(t, [[/\b(I wanted to let you know that|I'?m writing to let you know that|Just a note to say that) /gi, 'Great news — '],
      [/\bBest regards\b/gi, 'Thanks so much']].concat(FRIENDLY_SYN, CONTRACT)).replace(/\.(\s|$)/, '!$1');
  }
  /* spacing and common typos are always fixed; "Fix grammar" also caps and punctuates */
  function tidy(t) {
    return swap(t.replace(/([^•\s])[ \t]{2,}/g, '$1 ').replace(/\s+([,.!?])/g, '$1').replace(/,(?=[^\s\d])/g, ', ').replace(/\bi\b/g, 'I'), TYPOS);
  }
  function grammar(t) {
    var s = fixCaps(tidy(t));
    return /[A-Za-z0-9]$/.test(s) && words(s) >= 5 ? s + '.' : s;
  }
  function improve(t) {
    return swap(t, FILLER.slice(0, 6).concat(IMPROVE_SYN, CONTRACT));
  }
  var SYN = [[/\bupdate\b/gi, 'rundown'], [/\bquick\b/gi, 'brief'], [/\bgreat\b/gi, 'excellent'], [/\bhelp\b/gi, 'support'],
    [/\bI'd love\b/gi, "I'd really like"], [/\bjoin us\b/gi, 'come along'], [/\blet me know\b/gi, 'tell me'],
    [/\bwe're hosting\b/gi, "we're running"], [/\bwill cover\b/gi, 'will go through'], [/\bJust reply\b/g, 'Simply reply'],
    [/\bongoing\b/gi, 'current'], [/\bPractical\b/g, 'Hands-on'], [/\bSimple\b/g, 'Easy'], [/\bthink\b/gi, 'believe'],
    [/\bbusy\b/gi, 'stretched'], [/\bfocus on\b/gi, 'concentrate on']];
  /* phrase-level alternatives, used when the word swaps found nothing to change */
  var ALT = [[/\bI wanted to\b/g, "I'm writing to"], [/\bI'm writing to\b/g, 'I wanted to'], [/\bCould you\b/g, 'Would you be able to'],
    [/\bWould you be able to\b/g, 'Could you'], [/^Please\b/, 'Could you please'], [/\bLet me know\b/g, 'Please let me know'],
    [/\bI'd like to\b/g, 'I would like to'], [/\bas soon as possible\b/gi, 'at the earliest'], [/\bat the earliest\b/gi, 'as soon as possible'],
    [/\bThanks\b/g, 'Thank you'], [/\bget back to me\b/gi, 'let me know'], [/\bshare\b/gi, 'send over']];
  function rephrase(t, v) {
    var s = swap(t, SYN.filter(function (_, i) { return i % 2 === v % 2; }));
    if (s === t) s = swap(t, SYN);
    if (s === t) {                      /* still the same: one phrase-level change, a different one each version */
      for (var i = 0; i < ALT.length && s === t; i++) {
        var a = ALT[(i + v) % ALT.length];
        if (a[0].test(t)) s = t.replace(a[0], a[1]);
        a[0].lastIndex = 0;
      }
    }
    if (s === t && isFragment(t)) s = v % 2 ? sentence(t) : cap(t.replace(/^(requesting|request)\b/i, 'Request for').replace(/^Request for (quotes?)/i, 'Quote request'));
    return s;
  }

  /* q: { tone, len ('Shorter' | 'Longer'), grammar, improve, adds, variant } */
  function selParams() { return { tone: null, len: null, grammar: false, improve: false, adds: [], variant: 0, write: null }; }

  function rewrite(text, q) {
    /* "Draft an email requesting quotes" on a selection writes that email in its place */
    if (q.write) {
      var out = compose({ prompt: q.write, context: text, tone: q.tone === 'Casual' || q.tone === 'Friendly' ? q.tone : 'Professional',
        len: q.len === 'Longer' ? 'Long' : 'Short', variant: q.variant, adds: q.adds, bullets: false });
      if (words(text) <= 12) return out.text;
      return out.text.split('\n\n').slice(1, -2).join('\n\n');   /* inside a longer email: just the middle */
    }
    /* typos and stray phrasing ("Requsting for quotes") are always fixed */
    var orig = text;
    text = phrases(fixTypos(text));
    var s = q.grammar ? grammar(text) : tidy(text);
    if (q.improve) s = improve(s);
    if (q.len === 'Shorter') s = shorten(s); else if (q.len === 'Longer') s = lengthen(s, q.variant);
    if (q.tone === 'Professional') s = formal(s); else if (q.tone === 'Casual') s = casual(s); else if (q.tone === 'Friendly') s = friendly(s);
    /* a fragment picked from mid-sentence can't take a new sentence after it */
    var fragment = !/[.!?]["”']?$/.test(text);
    q.adds.forEach(function (a) { s += fragment ? ' — ' + lowerFirst(a).replace(/[.!]$/, '') : ' ' + a; });
    if (q.variant || (s === orig && !q.grammar)) s = rephrase(s, q.variant);
    s = fixCaps(s);
    /* ...and stays a fragment: no capital it didn't have */
    if (/^[a-z]/.test(text) && !/^I\b/.test(s)) s = s[0].toLowerCase() + s.slice(1);
    return s;
  }

  /* "Describe your change" for a selection → new params. Asking for what
     it already did counts as "try another way". */
  function refineSel(q, ask) {
    ask = phrases(fixTypos(ask));
    var n = JSON.parse(JSON.stringify(q)), a = ask.toLowerCase(), hit = false, lines = 0;
    /* asking for an email, not a change to these words */
    if (/\b(draft|write|compose|prepare|create)\b/.test(a) && /\b(e-?mail|mail|message|letter|note|reply)\b/.test(a) ||
        /^(an?\s+)?(e-?mail|mail)\b/.test(a) || /\b(turn|make|convert)\s+(this|it)\s+into\s+an?\s+(e-?mail|mail)\b/.test(a)) {
      n.write = ask; n.variant = q.write ? q.variant + 1 : 0; return n;
    }
    function add(line) { if (n.adds.indexOf(line) < 0) n.adds.push(line); hit = true; lines++; }
    if (/friendl|warm|nicer|kind|enthusias/.test(a)) { n.tone = 'Friendly'; hit = true; }
    else if (/casual|relax|informal|chill/.test(a)) { n.tone = 'Casual'; hit = true; }
    else if (/formal|professional|polite/.test(a)) { n.tone = 'Professional'; hit = true; }
    if (/short|concise|brief|trim|tight|cut/.test(a)) { n.len = 'Shorter'; hit = true; }
    else if (/long|detail|expand|elaborat/.test(a)) { n.len = 'Longer'; hit = true; }
    if (/grammar|spelling|typo|proofread|fix/.test(a)) { n.grammar = true; hit = true; }
    if (/improve|better|polish|clear|refine|rewrite|rephrase|reword|sound/.test(a)) { n.improve = true; hit = true; }
    if (/\b(sentence|complete|full)\b/.test(a) && !n.len) { n.len = 'Longer'; hit = true; }
    if (/record/.test(a)) add("Everyone who signs up gets the recording.");
    if (/deadline|urgent|asap|by (mon|tue|wed|thu|fri)/.test(a)) add("It would be great to hear back by Friday.");
    if (/thank/.test(a)) add('Thanks again — I really appreciate it.');
    var m = /\b(?:mention|add|include|say|note)\s+(?:that\s+)?(.+)$/i.exec(ask);
    if (m && !lines) add(cap(m[1].replace(/^(a\s+)?(line|sentence|note|bit)\s+(about|on|saying)\s+/i, '').replace(/[.!]+$/, '')) + '.');
    /* anything else still does something useful: polish it and try another wording */
    if (!hit) { n.improve = true; n.grammar = true; }
    if (!hit || JSON.stringify(n) === JSON.stringify(q)) n.variant++;
    return n;
  }

  /* ══════════════ streaming ═════════════════════════════════════════ */

  /* tick(partial) a few words at a time after a short think; returns stop */
  function stream(full, tick, done) {
    var parts = full.split(/(\s+)/), i = 0, id = null;
    var think = setTimeout(function () {
      id = setInterval(function () {
        i += 4;
        if (i >= parts.length) { clearInterval(id); id = null; done(); }
        else tick(parts.slice(0, i).join(''));
      }, 40);
    }, 900);
    return function () { clearTimeout(think); if (id) clearInterval(id); };
  }

  /* ══════════════ AI Refine — selecting text in the email ═══════════ */

  /* Shared by all three directions. The state they read and write:
       body   the email text            sel    { s, e } live selection
       caret  offset, null = the end    flash  { s, e } text AI just put back
       focus  'body' when typing there                                      */

  /* the email body as paragraphs that know their offset in the text, with
     one mark at most ({ s, e, cls, handles }) and the caret */
  function bodyHtml(t, mark, caret) {
    function at(x, ps, pe) {
      var h = '';
      if (mark && mark.handles && x === mark.e && x > ps) h += '<span class="hd trail"><i></i><b></b></span>';
      if (x === caret) h += CARET;
      if (mark && mark.handles && x === mark.s && x < pe) h += '<span class="hd lead"><i></i><b></b></span>';
      return h;
    }
    var out = '', o = 0;
    t.split('\n\n').forEach(function (p) {
      var ps = o, pe = o + p.length, cuts = [ps, pe];
      o = pe + 2;
      [mark && mark.s, mark && mark.e, caret].forEach(function (x) { if (x != null && x > ps && x < pe) cuts.push(x); });
      cuts = cuts.sort(function (a, b) { return a - b; }).filter(function (x, i, a) { return i === 0 || x !== a[i - 1]; });
      var h = at(ps, ps, pe);
      for (var i = 1; i < cuts.length; i++) {
        var a = cuts[i - 1], b = cuts[i], seg = fmt(t.slice(a, b));
        h += (mark && a >= mark.s && b <= mark.e ? '<span class="' + mark.cls + '">' + seg + '</span>' : seg) + at(b, ps, pe);
      }
      out += '<div class="para" data-o="' + ps + '">' + h + '</div>';
    });
    return '<div class="sel-text">' + out + '</div>';
  }

  /* the body as the composer shows it: live selection with handles, or
     the text AI Refine just put back, plus the caret while typing */
  function selBody(st) {
    var mark = st.sel ? { s: st.sel.s, e: st.sel.e, cls: 'selhl', handles: true }
      : st.flash ? { s: st.flash.s, e: st.flash.e, cls: 'rf-new' } : null;
    return bodyHtml(st.body, mark, st.focus === 'body' && !st.sel ? (st.caret == null ? st.body.length : st.caret) : null);
  }

  /* DOM point → offset in the body text (a <br> is one "\n") */
  function offsetOf(host, node, off) {
    var el = node.nodeType === 1 ? node : node.parentNode;
    var para = el.closest && el.closest('.para');
    if (!para || !host.contains(para)) {
      if (node === host) { var c = host.children[off]; return c ? +c.dataset.o : null; }
      return null;
    }
    var r = document.createRange();
    r.setStart(para, 0); r.setEnd(node, off);
    var f = r.cloneContents();
    return +para.dataset.o + f.textContent.length + f.querySelectorAll('br').length;
  }

  /* a selection snaps out to whole words and in past whitespace */
  function snap(t, s, e) {
    while (s > 0 && /[\w'’]/.test(t[s - 1]) && /[\w'’]/.test(t[s])) s--;
    while (e < t.length && /[\w'’]/.test(t[e]) && /[\w'’]/.test(t[e - 1])) e++;
    while (s < e && /\s/.test(t[s])) s++;
    while (e > s && /\s/.test(t[e - 1])) e--;
    return e > s ? { s: s, e: e } : null;
  }

  /* Figma 5525:2355 — iOS edit menu over the selection, bar collapses to AI Refine */
  /* bounds of the text itself, without leading / trailing blank lines */
  function allRange(t) {
    var s = t.search(/\S/), e = t.replace(/\s+$/, '').length;
    return s < 0 ? null : { s: s, e: e };
  }
  /* a selection gets Cut · Copy · Paste · Select All; a tap on the caret gets Select · Select All · Paste */
  function editMenu(st) {
    if (st.dragging) return '';
    var item = function (act, label) { return '<span data-act="' + act + '">' + label + '</span>'; };
    var all = allRange(st.body);
    if (st.sel) {
      var whole = all && st.sel.s <= all.s && st.sel.e >= all.e;
      return '<div class="ios-menu">' + item('m-cut', 'Cut') + item('m-copy', 'Copy') + item('m-paste', 'Paste') +
        (whole ? '' : item('m-all', 'Select All')) + '<div class="ios-menu-tail"></div></div>';
    }
    if (st.cmenu && st.focus === 'body') {
      return '<div class="ios-menu caret">' + (all ? item('m-select', 'Select') + item('m-all', 'Select All') : '') +
        item('m-paste', 'Paste') + '<div class="ios-menu-tail"></div></div>';
    }
    return '';
  }
  var EDIT_MENU = '';
  function refinePill(act) { return pill('i-ai-write', 'AI Refine', { act: act }); }
  var REFINE_CONFIRM = { title: 'Discard this rewrite?', body: 'Your selected text stays as it is in the email.', btn: 'Discard rewrite' };

  /* the body types at the caret; a selection is replaced by what's typed */
  function bodyTarget(st) {
    var a = st.sel ? st.sel.s : st.caret == null ? st.body.length : st.caret, b = st.sel ? st.sel.e : a;
    return {
      multiline: true,
      get: function () { return st.body.slice(0, a); },
      set: function (v) { st.body = v + st.body.slice(b); st.caret = v.length; st.sel = null; st.flash = null; st.cmenu = false; },
      backspace: st.sel ? function () { st.body = st.body.slice(0, a) + st.body.slice(b); st.caret = a; st.sel = null; st.cmenu = false; } : null
    };
  }

  /* the system clipboard when the browser allows it, and our own copy as a fallback */
  var lastClip = '';
  function clip(t) { lastClip = t; try { navigator.clipboard.writeText(t); } catch (x) { } }
  function wordAt(t, o) {
    var s = o, e = o;
    while (s > 0 && /[\w'’]/.test(t[s - 1])) s--;
    while (e < t.length && /[\w'’]/.test(t[e])) e++;
    if (s === e) {                 /* on a space or punctuation: the word before it */
      var b = s; while (b > 0 && !/[\w'’]/.test(t[b - 1])) b--;
      if (b === 0) return null;
      return wordAt(t, b - 1);
    }
    return { s: s, e: e };
  }
  /* the edit menu. true = handled */
  function editAct(a, st, api) {
    st.cmenu = false;
    if (a === 'm-cut' && st.sel) {
      clip(st.body.slice(st.sel.s, st.sel.e));
      st.caret = st.sel.s; st.body = st.body.slice(0, st.sel.s) + st.body.slice(st.sel.e); st.sel = null;
      api.toast({ msg: 'Cut' });
    } else if (a === 'm-copy' && st.sel) { clip(st.body.slice(st.sel.s, st.sel.e)); st.caret = st.sel.e; st.sel = null; api.toast({ msg: 'Copied' }); }
    else if (a === 'm-all') { st.sel = allRange(st.body); st.flash = null; st.focus = 'body'; api.render(); }
    else if (a === 'm-select') {
      var c = st.caret == null ? st.body.length : st.caret;
      st.sel = wordAt(st.body, c); st.flash = null; api.render();
    } else if (a === 'm-paste') {
      var put = function (txt) {
        txt = (txt || '').replace(/\r/g, '');
        if (!txt) return api.toast({ msg: 'Nothing to paste' });
        var s0 = st.sel ? st.sel.s : st.caret == null ? st.body.length : st.caret, e0 = st.sel ? st.sel.e : s0;
        st.body = st.body.slice(0, s0) + txt + st.body.slice(e0);
        st.caret = s0 + txt.length; st.sel = null; st.flash = null; st.focus = 'body';
        api.render();
      };
      try { navigator.clipboard.readText().then(function (t) { put(t || lastClip); }, function () { put(lastClip); }); }
      catch (x) { put(lastClip); }
    }
    else if (a === 'm-other') api.render();
    else return false;
    return true;
  }

  /* after each render: the edit menu sits above the selection (or under it
     near the top), and keepInView scrolls a refined selection above the AI surface */
  function placeSel(root, keepInView) {
    var phone = root.querySelector('.phone'), pr = phone.getBoundingClientRect(), k = pr.width / 402;
    var marks = root.querySelectorAll('.selhl'), menu = root.querySelector('.ios-menu');
    var caretEl = menu && !marks.length ? root.querySelector('.ios-body .sw-caret') : null;
    if (caretEl) marks = [caretEl];
    if (menu && marks.length) {
      var first = marks[0].getClientRects()[0], lr = marks[marks.length - 1].getClientRects(), last = lr[lr.length - 1];
      if (!first || !last) return;
      var w = menu.offsetWidth, top = (first.top - pr.top) / k - 58, below = false;
      if (top < 118) { top = (last.bottom - pr.top) / k + 22; below = true; }
      menu.style.top = top + 'px';
      menu.style.left = Math.max(8, Math.min(402 - 8 - w, ((first.left + first.right) / 2 - pr.left) / k - w / 2)) + 'px';
      menu.classList.toggle('below', below);
    }
    if (keepInView && marks.length) {
      var f = root.querySelector('.ios-fields'), fr = f.getBoundingClientRect(), mr = marks[0].getBoundingClientRect();
      if (mr.top < fr.top || mr.top > fr.bottom - 48) f.scrollTop += (mr.top - fr.top) / k - 24;
    }
  }

  /* Selecting text in the email.
     Mouse: native — drag, double- or triple-click; a click moves the caret.
     Touch: done by the prototype itself, like iOS — tap places the caret,
       tap the caret again for Select / Select All / Paste, double-tap or
       long-press selects a word (keep dragging to extend), and the handles
       drag. The browser's own selection is switched off on touch screens,
       which is what popped up Chrome's search sheet and its Cut / Copy menu
       on top of ours. ok(st) says whether the composer is the thing on screen. */
  var lastUp = 0, pendingCaret = null, swallow = false;
  function caretRange(x, y) {
    if (document.caretRangeFromPoint) return document.caretRangeFromPoint(x, y);
    var p = document.caretPositionFromPoint && document.caretPositionFromPoint(x, y);
    if (!p) return null;
    var r = document.createRange(); r.setStart(p.offsetNode, p.offset); return r;
  }
  /* screen point → offset in the body text (clamped to the text's start / end) */
  function offsetAt(x, y, len) {
    var host = document.querySelector('#phone .sel-text');
    if (!host) return null;
    var hr = host.getBoundingClientRect();
    if (y > hr.bottom) return len;
    if (y < hr.top) return 0;
    var paras = host.querySelectorAll('.para'), para = null;
    for (var i = 0; i < paras.length; i++) {        /* the paragraph on that line, or the one just above a gap */
      var pr = paras[i].getBoundingClientRect();
      if (y >= pr.top - 1) para = paras[i];
    }
    if (!para) return 0;
    var pb = para.getBoundingClientRect();
    if (y > pb.bottom) return +para.dataset.o + para.textContent.length;
    var r = caretRange(Math.max(pb.left + 1, Math.min(pb.right - 1, x)), y);
    if (r && para.contains(r.startContainer)) return offsetOf(host, r.startContainer, r.startOffset);
    return +para.dataset.o + (x > pb.left + pb.width / 2 ? para.textContent.length : 0);
  }
  function selectable(api, ok) {
    var coarse = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    var lastTouch = 0;
    document.getElementById('phone').addEventListener('mouseup', function (e) {
      /* the mouse events a browser makes up after a touch are not a mouse */
      if (Date.now() - lastTouch < 1000 || (e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents)) return;
      commit();
    });
    function commit() {
      var st = api.state();
      if (!ok(st)) return;
      var host = document.querySelector('#phone .sel-text'), ns = window.getSelection();
      if (!host || !ns.rangeCount) return;
      var r = ns.getRangeAt(0);
      if (!host.contains(r.startContainer) && r.startContainer !== host) return;
      lastUp = Date.now();
      var s = offsetOf(host, r.startContainer, r.startOffset), e = offsetOf(host, r.endContainer, r.endOffset);
      clearTimeout(pendingCaret);
      st.cmenu = false;
      if (!r.collapsed && s != null) {
        var sel = snap(st.body, s, e == null ? st.body.length : e);
        ns.removeAllRanges();
        st.sel = sel; st.flash = null; st.focus = 'body'; st.caret = sel ? null : s;
        return api.render();
      }
      pendingCaret = setTimeout(function () {
        if (window.getSelection().isCollapsed === false) return;
        st.sel = null; st.flash = null; st.focus = 'body'; st.caret = s;
        api.render();
      }, 220);
    }

    /* ── touch ── */
    var phone = document.getElementById('phone'), t0 = null, longT = null, drag = null, lastTap = null;
    function k() { var ph = phone.querySelector('.phone'); return ph ? ph.getBoundingClientRect().width / 402 : 1; }
    function inText(el) { return el.closest && el.closest('.ios-body') && el.closest('.ios-fields'); }
    /* Every render replaces the phone's DOM, and touch events keep going to
       the element the finger first landed on — which is then detached and no
       longer bubbles. So each gesture listens on its own start element. */
    function follow(el) {
      if (!el || el._tracked) return;
      el._tracked = true;
      el.addEventListener('touchmove', move, { passive: false });
      el.addEventListener('touchend', end, { passive: false });
      el.addEventListener('touchcancel', end, { passive: false });
    }
    phone.addEventListener('touchstart', function (e) {
      var st = api.state();
      lastTouch = Date.now(); swallow = false;
      follow(e.target);
      if (!ok(st) || e.touches.length > 1) { t0 = null; return; }
      var tt = e.touches[0], el = e.target, hd = el.closest && el.closest('.hd');
      clearTimeout(longT);
      if (hd && st.sel) {                       /* grab a handle */
        e.preventDefault();
        drag = { type: hd.classList.contains('lead') ? 'lead' : 'trail' };
        st.dragging = true; api.render();
        return;
      }
      if (!inText(el)) { t0 = null; return; }
      t0 = { x: tt.clientX, y: tt.clientY, at: Date.now(), moved: false };
      longT = setTimeout(function () {          /* long-press: select the word, then drag to extend */
        if (!t0 || t0.moved) return;
        var o = offsetAt(t0.x, t0.y, st.body.length);
        var w = o == null ? null : wordAt(st.body, Math.min(o, st.body.length));
        if (!w) { st.focus = 'body'; st.caret = o; st.cmenu = true; api.render(); t0 = null; return; }
        if (navigator.vibrate) try { navigator.vibrate(8); } catch (x) {}
        st.sel = w; st.flash = null; st.focus = 'body'; st.caret = null; st.cmenu = false; st.dragging = true;
        drag = { type: 'extend', anchor: w };
        t0 = null; swallow = true; api.render();
      }, 380);
    }, { passive: false });
    function move(e) {
      var st = api.state(), tt = e.touches[0];
      if (!tt) return;
      if (drag) {
        e.preventDefault();
        var y = tt.clientY + (drag.type === 'lead' ? 14 : drag.type === 'trail' ? -14 : 0) * k();
        var o = offsetAt(tt.clientX, y, st.body.length);
        if (o == null || !st.sel) return;
        var s0 = st.sel.s, e0 = st.sel.e;
        if (drag.type === 'extend') {
          var w = wordAt(st.body, Math.min(o, st.body.length)) || { s: o, e: o };
          s0 = Math.min(drag.anchor.s, w.s); e0 = Math.max(drag.anchor.e, w.e);
        } else if (drag.type === 'lead') {
          if (o >= e0) { drag.type = 'trail'; s0 = e0; e0 = o; } else s0 = o;
        } else {
          if (o <= s0) { drag.type = 'lead'; e0 = s0; s0 = o; } else e0 = o;
        }
        if (e0 > s0 && (s0 !== st.sel.s || e0 !== st.sel.e)) { st.sel = { s: s0, e: e0 }; api.render(); }
        return;
      }
      if (t0 && Math.abs(tt.clientX - t0.x) + Math.abs(tt.clientY - t0.y) > 10) { t0.moved = true; clearTimeout(longT); }
    }
    function end(e) {
      var st = api.state();
      lastTouch = Date.now();
      if (e.currentTarget && e.currentTarget._tracked && !e.touches.length) {
        e.currentTarget._tracked = false;
        e.currentTarget.removeEventListener('touchmove', move); e.currentTarget.removeEventListener('touchend', end); e.currentTarget.removeEventListener('touchcancel', end);
      }
      clearTimeout(longT);
      if (drag) {                               /* let go of a handle: the menu comes back */
        drag = null; st.dragging = false; lastUp = Date.now();
        if (e.cancelable) e.preventDefault();
        return api.render();
      }
      if (!t0 || t0.moved || e.type === 'touchcancel' || Date.now() - t0.at > 600) { t0 = null; return; }
      var x = t0.x, y = t0.y; t0 = null;
      var o = offsetAt(x, y, st.body.length);
      if (o == null) return;
      lastUp = Date.now();
      if (e.cancelable) e.preventDefault();      /* no synthetic click, no double-tap zoom */
      var dbl = lastTap && Date.now() - lastTap.at < 320 && Math.abs(x - lastTap.x) < 24 && Math.abs(y - lastTap.y) < 24;
      lastTap = { x: x, y: y, at: Date.now() };
      st.flash = null;
      if (dbl) {                                 /* double-tap: the word */
        var w = wordAt(st.body, Math.min(o, st.body.length));
        if (w) { st.sel = w; st.focus = 'body'; st.caret = null; st.cmenu = false; lastTap = null; return api.render(); }
      }
      /* caret goes to the nearer edge of the tapped word, like iOS */
      var tw = wordAt(st.body, Math.min(o, st.body.length));
      if (tw && o > tw.s && o < tw.e) o = o - tw.s < tw.e - o ? tw.s : tw.e;
      var cur = st.caret == null ? st.body.length : st.caret;
      var again = st.focus === 'body' && !st.sel && Math.abs(cur - o) <= 1;
      st.sel = null; st.focus = 'body'; st.caret = o; st.cmenu = again ? !st.cmenu : false;
      api.render();
    }
  }
  /* the click that follows a text mouseup is already handled */
  function tappedText() {
    if (swallow) { swallow = false; return true; }
    return Date.now() - lastUp < 400;
  }

  /* the review card for a refine: the selection on top, the rewrite below */
  function refineCard(orig, o) {
    return '<div class="sw-draft' + (o.shimmer ? ' shimmer' : '') + '" data-scroll="' + (o.key || 'rf') + '"' +
      (o.pin ? ' data-pin="end"' : '') + (o.act ? ' data-act="' + o.act + '"' : '') + '>' +
      '<div class="rf-orig"><b>Your selection</b>' + esc(orig) + '</div>' +
      '<div class="rf-head"><b>Rewrite</b>' + verStepper(o.ver) + '</div>' +
      (o.text == null ? BARS : fmt(o.text)) + '</div>';
  }

  /* ══════════════ app loop ══════════════════════════════════════════ */

  /* re-render without losing anyone's scroll position */
  function mount(root, html) {
    var keep = {};
    root.querySelectorAll('[data-scroll]').forEach(function (n) { keep[n.dataset.scroll] = n.scrollTop; });
    root.innerHTML = html;
    root.querySelectorAll('[data-scroll]').forEach(function (n) {
      var pin = n.dataset.pin;
      if (pin === 'end' || (pin === 'typing' && kb.typed)) n.scrollTop = n.scrollHeight;
      else if (n.dataset.scroll in keep) n.scrollTop = keep[n.dataset.scroll];
    });
    kb.typed = false;
  }


  /* on a phone the option list becomes a small floating widget: tap to open,
     drag to move it out of the way (position remembered per browser) */
  function floater() {
    var links = document.querySelectorAll('.panel .others a');
    if (!links.length) return;
    var on = document.querySelector('.panel .others a.on') || links[0];
    var w = document.createElement('div');
    w.className = 'fab';
    w.innerHTML = '<button type="button" class="fab-btn" aria-label="Switch option">' +
      '<span class="fab-n">' + on.querySelector('.n').textContent + '</span><span class="fab-lbl">Option</span>' +
      '<svg class="fab-chev" viewBox="0 0 24 24"><path d="m6 15 6-6 6 6" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
      '<div class="fab-menu">' + Array.prototype.map.call(links, function (a) {
        return '<a href="' + a.getAttribute('href') + '"' + (a === on ? ' class="on"' : '') + '>' + a.innerHTML + '</a>';
      }).join('') + '</div>';
    document.body.appendChild(w);
    var btn = w.querySelector('.fab-btn');
    try { var p = JSON.parse(localStorage.getItem('fab-pos')); if (p) { w.style.left = p.x + 'px'; w.style.top = p.y + 'px'; w.style.right = 'auto'; w.style.bottom = 'auto'; } } catch (e) {}
    function clamp() {
      var r = w.getBoundingClientRect();
      if (!w.style.left) return;
      var x = Math.max(6, Math.min(window.innerWidth - r.width - 6, r.left)), y = Math.max(6, Math.min(window.innerHeight - r.height - 6, r.top));
      w.style.left = x + 'px'; w.style.top = y + 'px';
    }
    var drag = null, moved = false;
    btn.addEventListener('pointerdown', function (e) {
      var r = w.getBoundingClientRect();
      drag = { dx: e.clientX - r.left, dy: e.clientY - r.top, sx: e.clientX, sy: e.clientY }; moved = false;
      btn.setPointerCapture(e.pointerId);
    });
    btn.addEventListener('pointermove', function (e) {
      if (!drag) return;
      if (!moved && Math.abs(e.clientX - drag.sx) + Math.abs(e.clientY - drag.sy) < 8) return;
      moved = true; w.classList.remove('open');
      w.style.right = 'auto'; w.style.bottom = 'auto';
      w.style.left = (e.clientX - drag.dx) + 'px'; w.style.top = (e.clientY - drag.dy) + 'px';
      clamp();
    });
    btn.addEventListener('pointerup', function () {
      if (!drag) return;
      drag = null;
      if (moved) { var r = w.getBoundingClientRect(); try { localStorage.setItem('fab-pos', JSON.stringify({ x: r.left, y: r.top })); } catch (e) {} return; }
      w.classList.toggle('open');
      var r2 = w.getBoundingClientRect();
      w.classList.toggle('down', r2.top < window.innerHeight * .35);   /* open the menu away from the edge */
    });
    document.addEventListener('pointerdown', function (e) { if (!w.contains(e.target)) w.classList.remove('open'); });
    window.addEventListener('resize', clamp);
  }

  /* Desktop: the 402×874 phone scales down to fit the window.
     Phone: the prototype IS the screen — full width, and the height stretches
     to whatever the browser leaves (address bar shown or hidden), so the
     keyboard stays full size and anchored to the bottom. */
  var MIN_PH = 640;
  function fit() {
    var wrap = document.querySelector('.device-wrap');
    function f() {
      var vv = window.visualViewport, vw = window.innerWidth, vh = window.innerHeight, s, ph = 874;
      if (vw <= 600) {
        /* the on-screen (real) keyboard shrinks the visual viewport — ignore that, the prototype draws its own */
        if (vv && vv.scale === 1 && vv.height > vh * 0.7) vh = vv.height;
        var nav = document.querySelector('.panel'), h = vh - (nav ? nav.offsetHeight : 0);
        s = vw / 402; ph = h / s;
        if (ph < MIN_PH) { s = h / MIN_PH; ph = MIN_PH; }   /* very short window: fall back to scaling */
      } else {
        s = Math.min(1, (vh - 48) / 874);
        if (vw < 860) s = Math.min(s, (vw - 32) / 402);
        s = Math.max(.5, s);
      }
      wrap.style.setProperty('--s', s.toFixed(4));
      wrap.style.setProperty('--ph', Math.floor(ph) + 'px');
    }
    f(); window.addEventListener('resize', f); window.addEventListener('load', f);
    if (window.visualViewport) window.visualViewport.addEventListener('resize', f);
    if (window.ResizeObserver && document.querySelector('.panel')) new ResizeObserver(f).observe(document.querySelector('.panel'));
    window.addEventListener('orientationchange', function () { setTimeout(f, 200); });
  }

  /* cfg: init() → state, view(st) → html, act(a, el, st, api),
     target(st, api) → keyboard target or null, escape(st, api) */
  function app(cfg) {
    var root = document.getElementById('phone'), st = cfg.init(), toastTimer = null;
    var api = {
      state: function () { return st; },
      render: function () { mount(root, cfg.view(st)); if (cfg.after) cfg.after(root, st); },
      reset: function () {
        if (st.stop) st.stop();
        clearTimeout(toastTimer);
        st = cfg.init(); kb.shift = false; api.render();
      },
      toast: function (t) {
        st.toast = t; api.render();
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { st.toast = null; api.render(); }, t.act ? 5000 : 2600);
      }
    };
    kb.target = function () { return cfg.target(st, api); };
    kb.changed = api.render;
    kb.escape = function () { if (cfg.escape) cfg.escape(st, api); };

    /* The keyboard types on touch-DOWN, like a real one. Waiting for "click"
       dropped fast taps: every key re-renders the phone, so the element a
       finger went down on was gone by the time the click would fire. A touch
       in the gap between keys goes to the nearest key, so there are no dead zones. */
    var repeat = null, pressTimer = null;
    function nearestKey(kbdEl, x, y) {
      var bestEl = null, bestD = 1e9;
      kbdEl.querySelectorAll('[data-key],[data-sug]').forEach(function (k) {
        var r = k.getBoundingClientRect();
        var dx = Math.max(r.left - x, 0, x - r.right), dy = Math.max(r.top - y, 0, y - r.bottom), d = dx * dx + dy * dy;
        if (d < bestD) { bestD = d; bestEl = k; }
      });
      var k = root.querySelector('.phone').getBoundingClientRect().width / 402;
      return bestD <= (14 * k) * (14 * k) ? bestEl : null;
    }
    function press(c) {
      kb.pressed = c; clearTimeout(pressTimer);
      pressTimer = setTimeout(function () { kb.pressed = null; api.render(); }, 110);
    }
    function typeKey(c) {
      press(c);
      if (c === 'shift') { kb.shift = !kb.shift; api.render(); }
      else if (c === 'layer') { kb.layer = kb.layer === '123' ? 'abc' : '123'; kb.shift = false; api.render(); }
      else if (c === 'del') backspace();
      else if (c === 'space') insert(' ', true);
      else if (c === 'enter') enter();
      else {
        insert(c, true);
        if (kb.layer === '123' && c === "'") { kb.layer = 'abc'; api.render(); }
      }
    }
    function stopRepeat() { clearTimeout(repeat); clearInterval(repeat); repeat = null; }
    root.addEventListener('pointerdown', function (e) {
      var kbdEl = e.target.closest('.ios-kbd');
      if (!kbdEl || e.button > 0) return;
      e.preventDefault();
      var k = e.target.closest('[data-key],[data-sug]') || nearestKey(kbdEl, e.clientX, e.clientY);
      if (!k) return;
      if (k.dataset.sug != null) { press('sug'); return pick(k.dataset.sug); }
      var c = k.dataset.key;
      typeKey(c);
      if (c === 'del') {          /* hold to keep deleting */
        stopRepeat();
        repeat = setTimeout(function () { repeat = setInterval(function () { press('del'); backspace(); }, 70); }, 420);
      }
    });
    ['pointerup', 'pointercancel', 'blur'].forEach(function (n) { (n === 'blur' ? window : document).addEventListener(n, stopRepeat); });
    root.addEventListener('mousedown', function (e) { if (e.target.closest('.ios-kbd')) e.preventDefault(); });
    root.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    root.addEventListener('click', function (e) {
      if (e.target.closest('.ios-kbd')) return;     /* already typed on pointerdown */
      var a = e.target.closest('[data-act]');
      if (!a) return;
      var name = a.dataset.act;
      /* header: Send and × both start a fresh email */
      if (name === 'send' || name === 'trash') {
        api.reset();
        return api.toast({ msg: name === 'send' ? 'Sent — here’s a fresh email' : 'Email discarded' });
      }
      cfg.act(name, a, st, api);
    });
    document.querySelectorAll('[data-reset]').forEach(function (b) { b.onclick = api.reset; });
    floater();
    fit();
    api.render();
    return api;
  }

  return {
    app: app, shell: shell, kbd: kbd, ico: ico, pill: pill, esc: esc, fmt: fmt, text: text, CARET: CARET, BARS: BARS,
    COMPOSE_ROW: COMPOSE_ROW, draftCard: draftCard, verStepper: verStepper, confirmSheet: confirmSheet,
    cField: cField, cChip: cChip, cLeft: cLeft, dock: dock, stream: stream,
    ai: { params: params, compose: compose, refine: refine, selParams: selParams, rewrite: rewrite, refineSel: refineSel, isNote: isNote, fix: fixTypos },
    sel: {
      bodyHtml: bodyHtml, body: selBody, target: bodyTarget, act: editAct, place: placeSel, watch: selectable,
      tapped: tappedText, card: refineCard, pill: refinePill, MENU: EDIT_MENU, menu: editMenu, CONFIRM: REFINE_CONFIRM, LENS: ['Shorter', 'Longer']
    },
    TONES: ['Professional', 'Casual', 'Friendly'], LENS: ['Short', 'Long']
  };
})();
