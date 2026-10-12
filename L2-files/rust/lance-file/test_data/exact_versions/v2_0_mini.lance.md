> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../../../../V21-PROTOCOL.md).

# rust/lance-file/test_data/exact_versions/v2_0_mini.lance

**Analyzed binary: all 22,961 bytes; line_count=null.** Byte coordinates are zero-based half-open intervals. Pinned embedded V2_0 mini file requiring an external schema; two physical columns and 257 rows. All data, metadata, offset tables and footer bytes are interpreted. No callable symbols.

[Module contracts](../../../../../L1-modules/archive/rust-lance-file-embedded-fixtures.md) · [Format specification](../../../../../L3-symbols/format-spec.md) · [Development workflow](../../../../../L4-crosscutting/build-and-test.md) · [Inventory](../../../../../archive/pre-v21/MANIFEST.json)

SHA-256: `5e3fc99b01a4d2f5d16a2fb051dacb49b4a736428b1494715cd83633ad142a63`. KB-side inspection and full decoded-value comparisons only. Repository generators and Rust compatibility tests were not executed. Historical commit provenance is documented by the fixture README, not independently qualified. Modern encoding implementations remain pending outside narrowly read context.

[Preserved original bytes](../../../../../evidence/binary/v2_0_mini.lance), [all decoded rows](../../../../../evidence/binary/v2_0_mini-decoded-rows.json), [parsed protobufs, page catalog and region hashes](../../../../../analysis/iteration-067-v2_0_mini-fixture.json), [offline interpretation tool](../../../../../tools/analyze-embedded-fixtures.mjs). Exact original bytes replace a fabricated numbered source appendix.

## Whole-file contract

Input is the first257 rows of id/name projected from the deterministic compatibility fixture: id=r and name=null for r%7=0, otherwise value-NNNN-deterministic-fixture. Schema is Int32 nonnullable id0, Utf8 nullable name1 with compression=none. There are37 null names and220 nonnull32-byte strings. Both embedded artifacts have identical data[0,10124) and identical12765 metadata bytes, shifted100 bytes by the self-described descriptor. (rust/lance-file/test_data/exact_versions/datagen.rs:37-42; rust/lance-file/test_data/exact_versions/datagen.rs:73-78; rust/lance-file/test_data/exact_versions/datagen.rs:158-183; rust/lance-file/test_data/exact_versions/datagen.rs:219-225; rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:0-22961)

Every page priority is0 and omitted on the wire; reconstruct row order by cumulative page lengths. No alignment padding is inserted by the embedded page-buffer append path, although the options contain buffer_alignment64. This file is not evidence that standard file writers omit alignment. (rust/lance-encoding/src/encoder.rs:380-395; rust/lance-encoding/src/array_encoding/logical/primitive.rs:479-509; rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:0-10124)

## Complete page catalog

All intervals are [start,end). Every data byte is decoded; metadata intervals include the outer Page field tag/length. Integer pages use Nullable/NoNull/Flat32. Name pages use Binary with Nullable/NoNull/Flat64 indices and Flat8 bytes with explicit compression=none. (protos/file2.proto:170-216; protos/encodings_v2_0.proto:44-80; protos/encodings_v2_0.proto:174-188; protos/encodings_v2_0.proto:246-250; rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:10124-22889)

| Column/page | Rows | Metadata bytes | Buffer positions | Buffer sizes | Stored values or indices | Null adjustment |
|---|---|---|---|---|---|---|
| 0/0 | [0,16) | [10167,10229) | 0 | 64 | 0..15 | none |
| 0/1 | [16,32) | [10229,10291) | 64 | 64 | 16..31 | none |
| 0/2 | [32,48) | [10291,10354) | 128 | 64 | 32..47 | none |
| 0/3 | [48,64) | [10354,10417) | 192 | 64 | 48..63 | none |
| 0/4 | [64,80) | [10417,10480) | 256 | 64 | 64..79 | none |
| 0/5 | [80,96) | [10480,10543) | 320 | 64 | 80..95 | none |
| 0/6 | [96,112) | [10543,10606) | 384 | 64 | 96..111 | none |
| 0/7 | [112,128) | [10606,10669) | 448 | 64 | 112..127 | none |
| 0/8 | [128,144) | [10669,10732) | 512 | 64 | 128..143 | none |
| 0/9 | [144,160) | [10732,10795) | 576 | 64 | 144..159 | none |
| 0/10 | [160,176) | [10795,10858) | 640 | 64 | 160..175 | none |
| 0/11 | [176,192) | [10858,10921) | 704 | 64 | 176..191 | none |
| 0/12 | [192,208) | [10921,10984) | 768 | 64 | 192..207 | none |
| 0/13 | [208,224) | [10984,11047) | 832 | 64 | 208..223 | none |
| 0/14 | [224,240) | [11047,11110) | 896 | 64 | 224..239 | none |
| 0/15 | [240,256) | [11110,11173) | 960 | 64 | 240..255 | none |
| 0/16 | [256,257) | [11173,11236) | 1024 | 4 | 256..256 | none |
| 1/0 | [0,2) | [11279,11369) | 1028,1044 | 16,32 | 33,32 | 33 |
| 1/1 | [2,4) | [11369,11459) | 1076,1092 | 16,64 | 32,64 | 65 |
| 1/2 | [4,6) | [11459,11549) | 1156,1172 | 16,64 | 32,64 | 65 |
| 1/3 | [6,8) | [11549,11639) | 1236,1252 | 16,32 | 32,65 | 33 |
| 1/4 | [8,10) | [11639,11729) | 1284,1300 | 16,64 | 32,64 | 65 |
| 1/5 | [10,12) | [11729,11819) | 1364,1380 | 16,64 | 32,64 | 65 |
| 1/6 | [12,14) | [11819,11909) | 1444,1460 | 16,64 | 32,64 | 65 |
| 1/7 | [14,16) | [11909,11999) | 1524,1540 | 16,32 | 33,32 | 33 |
| 1/8 | [16,18) | [11999,12089) | 1572,1588 | 16,64 | 32,64 | 65 |
| 1/9 | [18,20) | [12089,12179) | 1652,1668 | 16,64 | 32,64 | 65 |
| 1/10 | [20,22) | [12179,12269) | 1732,1748 | 16,32 | 32,65 | 33 |
| 1/11 | [22,24) | [12269,12359) | 1780,1796 | 16,64 | 32,64 | 65 |
| 1/12 | [24,26) | [12359,12449) | 1860,1876 | 16,64 | 32,64 | 65 |
| 1/13 | [26,28) | [12449,12539) | 1940,1956 | 16,64 | 32,64 | 65 |
| 1/14 | [28,30) | [12539,12629) | 2020,2036 | 16,32 | 33,32 | 33 |
| 1/15 | [30,32) | [12629,12719) | 2068,2084 | 16,64 | 32,64 | 65 |
| 1/16 | [32,34) | [12719,12809) | 2148,2164 | 16,64 | 32,64 | 65 |
| 1/17 | [34,36) | [12809,12899) | 2228,2244 | 16,32 | 32,65 | 33 |
| 1/18 | [36,38) | [12899,12989) | 2276,2292 | 16,64 | 32,64 | 65 |
| 1/19 | [38,40) | [12989,13079) | 2356,2372 | 16,64 | 32,64 | 65 |
| 1/20 | [40,42) | [13079,13169) | 2436,2452 | 16,64 | 32,64 | 65 |
| 1/21 | [42,44) | [13169,13259) | 2516,2532 | 16,32 | 33,32 | 33 |
| 1/22 | [44,46) | [13259,13349) | 2564,2580 | 16,64 | 32,64 | 65 |
| 1/23 | [46,48) | [13349,13439) | 2644,2660 | 16,64 | 32,64 | 65 |
| 1/24 | [48,50) | [13439,13529) | 2724,2740 | 16,32 | 32,65 | 33 |
| 1/25 | [50,52) | [13529,13619) | 2772,2788 | 16,64 | 32,64 | 65 |
| 1/26 | [52,54) | [13619,13709) | 2852,2868 | 16,64 | 32,64 | 65 |
| 1/27 | [54,56) | [13709,13799) | 2932,2948 | 16,64 | 32,64 | 65 |
| 1/28 | [56,58) | [13799,13889) | 3012,3028 | 16,32 | 33,32 | 33 |
| 1/29 | [58,60) | [13889,13979) | 3060,3076 | 16,64 | 32,64 | 65 |
| 1/30 | [60,62) | [13979,14069) | 3140,3156 | 16,64 | 32,64 | 65 |
| 1/31 | [62,64) | [14069,14159) | 3220,3236 | 16,32 | 32,65 | 33 |
| 1/32 | [64,66) | [14159,14249) | 3268,3284 | 16,64 | 32,64 | 65 |
| 1/33 | [66,68) | [14249,14339) | 3348,3364 | 16,64 | 32,64 | 65 |
| 1/34 | [68,70) | [14339,14429) | 3428,3444 | 16,64 | 32,64 | 65 |
| 1/35 | [70,72) | [14429,14519) | 3508,3524 | 16,32 | 33,32 | 33 |
| 1/36 | [72,74) | [14519,14609) | 3556,3572 | 16,64 | 32,64 | 65 |
| 1/37 | [74,76) | [14609,14699) | 3636,3652 | 16,64 | 32,64 | 65 |
| 1/38 | [76,78) | [14699,14789) | 3716,3732 | 16,32 | 32,65 | 33 |
| 1/39 | [78,80) | [14789,14879) | 3764,3780 | 16,64 | 32,64 | 65 |
| 1/40 | [80,82) | [14879,14969) | 3844,3860 | 16,64 | 32,64 | 65 |
| 1/41 | [82,84) | [14969,15059) | 3924,3940 | 16,64 | 32,64 | 65 |
| 1/42 | [84,86) | [15059,15149) | 4004,4020 | 16,32 | 33,32 | 33 |
| 1/43 | [86,88) | [15149,15239) | 4052,4068 | 16,64 | 32,64 | 65 |
| 1/44 | [88,90) | [15239,15329) | 4132,4148 | 16,64 | 32,64 | 65 |
| 1/45 | [90,92) | [15329,15419) | 4212,4228 | 16,32 | 32,65 | 33 |
| 1/46 | [92,94) | [15419,15509) | 4260,4276 | 16,64 | 32,64 | 65 |
| 1/47 | [94,96) | [15509,15599) | 4340,4356 | 16,64 | 32,64 | 65 |
| 1/48 | [96,98) | [15599,15689) | 4420,4436 | 16,64 | 32,64 | 65 |
| 1/49 | [98,100) | [15689,15779) | 4500,4516 | 16,32 | 33,32 | 33 |
| 1/50 | [100,102) | [15779,15869) | 4548,4564 | 16,64 | 32,64 | 65 |
| 1/51 | [102,104) | [15869,15959) | 4628,4644 | 16,64 | 32,64 | 65 |
| 1/52 | [104,106) | [15959,16049) | 4708,4724 | 16,32 | 32,65 | 33 |
| 1/53 | [106,108) | [16049,16139) | 4756,4772 | 16,64 | 32,64 | 65 |
| 1/54 | [108,110) | [16139,16229) | 4836,4852 | 16,64 | 32,64 | 65 |
| 1/55 | [110,112) | [16229,16319) | 4916,4932 | 16,64 | 32,64 | 65 |
| 1/56 | [112,114) | [16319,16409) | 4996,5012 | 16,32 | 33,32 | 33 |
| 1/57 | [114,116) | [16409,16499) | 5044,5060 | 16,64 | 32,64 | 65 |
| 1/58 | [116,118) | [16499,16589) | 5124,5140 | 16,64 | 32,64 | 65 |
| 1/59 | [118,120) | [16589,16679) | 5204,5220 | 16,32 | 32,65 | 33 |
| 1/60 | [120,122) | [16679,16769) | 5252,5268 | 16,64 | 32,64 | 65 |
| 1/61 | [122,124) | [16769,16859) | 5332,5348 | 16,64 | 32,64 | 65 |
| 1/62 | [124,126) | [16859,16949) | 5412,5428 | 16,64 | 32,64 | 65 |
| 1/63 | [126,128) | [16949,17039) | 5492,5508 | 16,32 | 33,32 | 33 |
| 1/64 | [128,130) | [17039,17129) | 5540,5556 | 16,64 | 32,64 | 65 |
| 1/65 | [130,132) | [17129,17219) | 5620,5636 | 16,64 | 32,64 | 65 |
| 1/66 | [132,134) | [17219,17309) | 5700,5716 | 16,32 | 32,65 | 33 |
| 1/67 | [134,136) | [17309,17399) | 5748,5764 | 16,64 | 32,64 | 65 |
| 1/68 | [136,138) | [17399,17489) | 5828,5844 | 16,64 | 32,64 | 65 |
| 1/69 | [138,140) | [17489,17579) | 5908,5924 | 16,64 | 32,64 | 65 |
| 1/70 | [140,142) | [17579,17669) | 5988,6004 | 16,32 | 33,32 | 33 |
| 1/71 | [142,144) | [17669,17759) | 6036,6052 | 16,64 | 32,64 | 65 |
| 1/72 | [144,146) | [17759,17849) | 6116,6132 | 16,64 | 32,64 | 65 |
| 1/73 | [146,148) | [17849,17939) | 6196,6212 | 16,32 | 32,65 | 33 |
| 1/74 | [148,150) | [17939,18029) | 6244,6260 | 16,64 | 32,64 | 65 |
| 1/75 | [150,152) | [18029,18119) | 6324,6340 | 16,64 | 32,64 | 65 |
| 1/76 | [152,154) | [18119,18209) | 6404,6420 | 16,64 | 32,64 | 65 |
| 1/77 | [154,156) | [18209,18299) | 6484,6500 | 16,32 | 33,32 | 33 |
| 1/78 | [156,158) | [18299,18389) | 6532,6548 | 16,64 | 32,64 | 65 |
| 1/79 | [158,160) | [18389,18479) | 6612,6628 | 16,64 | 32,64 | 65 |
| 1/80 | [160,162) | [18479,18569) | 6692,6708 | 16,32 | 32,65 | 33 |
| 1/81 | [162,164) | [18569,18659) | 6740,6756 | 16,64 | 32,64 | 65 |
| 1/82 | [164,166) | [18659,18749) | 6820,6836 | 16,64 | 32,64 | 65 |
| 1/83 | [166,168) | [18749,18839) | 6900,6916 | 16,64 | 32,64 | 65 |
| 1/84 | [168,170) | [18839,18929) | 6980,6996 | 16,32 | 33,32 | 33 |
| 1/85 | [170,172) | [18929,19019) | 7028,7044 | 16,64 | 32,64 | 65 |
| 1/86 | [172,174) | [19019,19109) | 7108,7124 | 16,64 | 32,64 | 65 |
| 1/87 | [174,176) | [19109,19199) | 7188,7204 | 16,32 | 32,65 | 33 |
| 1/88 | [176,178) | [19199,19289) | 7236,7252 | 16,64 | 32,64 | 65 |
| 1/89 | [178,180) | [19289,19379) | 7316,7332 | 16,64 | 32,64 | 65 |
| 1/90 | [180,182) | [19379,19469) | 7396,7412 | 16,64 | 32,64 | 65 |
| 1/91 | [182,184) | [19469,19559) | 7476,7492 | 16,32 | 33,32 | 33 |
| 1/92 | [184,186) | [19559,19649) | 7524,7540 | 16,64 | 32,64 | 65 |
| 1/93 | [186,188) | [19649,19739) | 7604,7620 | 16,64 | 32,64 | 65 |
| 1/94 | [188,190) | [19739,19829) | 7684,7700 | 16,32 | 32,65 | 33 |
| 1/95 | [190,192) | [19829,19919) | 7732,7748 | 16,64 | 32,64 | 65 |
| 1/96 | [192,194) | [19919,20009) | 7812,7828 | 16,64 | 32,64 | 65 |
| 1/97 | [194,196) | [20009,20099) | 7892,7908 | 16,64 | 32,64 | 65 |
| 1/98 | [196,198) | [20099,20189) | 7972,7988 | 16,32 | 33,32 | 33 |
| 1/99 | [198,200) | [20189,20279) | 8020,8036 | 16,64 | 32,64 | 65 |
| 1/100 | [200,202) | [20279,20369) | 8100,8116 | 16,64 | 32,64 | 65 |
| 1/101 | [202,204) | [20369,20459) | 8180,8196 | 16,32 | 32,65 | 33 |
| 1/102 | [204,206) | [20459,20549) | 8228,8244 | 16,64 | 32,64 | 65 |
| 1/103 | [206,208) | [20549,20639) | 8308,8324 | 16,64 | 32,64 | 65 |
| 1/104 | [208,210) | [20639,20729) | 8388,8404 | 16,64 | 32,64 | 65 |
| 1/105 | [210,212) | [20729,20819) | 8468,8484 | 16,32 | 33,32 | 33 |
| 1/106 | [212,214) | [20819,20909) | 8516,8532 | 16,64 | 32,64 | 65 |
| 1/107 | [214,216) | [20909,20999) | 8596,8612 | 16,64 | 32,64 | 65 |
| 1/108 | [216,218) | [20999,21089) | 8676,8692 | 16,32 | 32,65 | 33 |
| 1/109 | [218,220) | [21089,21179) | 8724,8740 | 16,64 | 32,64 | 65 |
| 1/110 | [220,222) | [21179,21269) | 8804,8820 | 16,64 | 32,64 | 65 |
| 1/111 | [222,224) | [21269,21359) | 8884,8900 | 16,64 | 32,64 | 65 |
| 1/112 | [224,226) | [21359,21449) | 8964,8980 | 16,32 | 33,32 | 33 |
| 1/113 | [226,228) | [21449,21539) | 9012,9028 | 16,64 | 32,64 | 65 |
| 1/114 | [228,230) | [21539,21629) | 9092,9108 | 16,64 | 32,64 | 65 |
| 1/115 | [230,232) | [21629,21719) | 9172,9188 | 16,32 | 32,65 | 33 |
| 1/116 | [232,234) | [21719,21809) | 9220,9236 | 16,64 | 32,64 | 65 |
| 1/117 | [234,236) | [21809,21899) | 9300,9316 | 16,64 | 32,64 | 65 |
| 1/118 | [236,238) | [21899,21989) | 9380,9396 | 16,64 | 32,64 | 65 |
| 1/119 | [238,240) | [21989,22079) | 9460,9476 | 16,32 | 33,32 | 33 |
| 1/120 | [240,242) | [22079,22169) | 9508,9524 | 16,64 | 32,64 | 65 |
| 1/121 | [242,244) | [22169,22259) | 9588,9604 | 16,64 | 32,64 | 65 |
| 1/122 | [244,246) | [22259,22349) | 9668,9684 | 16,32 | 32,65 | 33 |
| 1/123 | [246,248) | [22349,22439) | 9716,9732 | 16,64 | 32,64 | 65 |
| 1/124 | [248,250) | [22439,22529) | 9796,9812 | 16,64 | 32,64 | 65 |
| 1/125 | [250,252) | [22529,22619) | 9876,9892 | 16,64 | 32,64 | 65 |
| 1/126 | [252,254) | [22619,22709) | 9956,9972 | 16,32 | 33,32 | 33 |
| 1/127 | [254,256) | [22709,22799) | 10004,10020 | 16,64 | 32,64 | 65 |
| 1/128 | [256,257) | [22799,22889) | 10084,10092 | 8,32 | 32 | 33 |

## Every byte region

### Bytes 0-64

Column0 id page0: 16 contiguous little-endian Int32 values 0..15, exactly 64 bytes. Nullable(NoNull(Flat32)) uses page buffer0 and no validity, compression or padding. Logical row interval [0,16); stored priority0 is unused by this V2_0 encoder, not the row start.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:0-64. Interpretation: rust/lance-file/test_data/exact_versions/datagen.rs:37-42; protos/encodings_v2_0.proto:63-80; protos/encodings_v2_0.proto:174-188. SHA-256: `5d85718ec594b982c252d0279e5966ffca33a5eaf2a455038d3ab331fde70cea`.

### Bytes 64-128

Column0 id page1: 16 contiguous little-endian Int32 values 16..31, exactly 64 bytes. Nullable(NoNull(Flat32)) uses page buffer0 and no validity, compression or padding. Logical row interval [16,32); stored priority0 is unused by this V2_0 encoder, not the row start.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:64-128. Interpretation: rust/lance-file/test_data/exact_versions/datagen.rs:37-42; protos/encodings_v2_0.proto:63-80; protos/encodings_v2_0.proto:174-188. SHA-256: `e9512b567a9e967b6e872380418de278fda0606358af1a6720aa0a173a532e8f`.

### Bytes 128-192

Column0 id page2: 16 contiguous little-endian Int32 values 32..47, exactly 64 bytes. Nullable(NoNull(Flat32)) uses page buffer0 and no validity, compression or padding. Logical row interval [32,48); stored priority0 is unused by this V2_0 encoder, not the row start.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:128-192. Interpretation: rust/lance-file/test_data/exact_versions/datagen.rs:37-42; protos/encodings_v2_0.proto:63-80; protos/encodings_v2_0.proto:174-188. SHA-256: `42ea914f9e22c4c13861de69552531ccb787e6037b7ccc71e6dfd1da159ae58e`.

### Bytes 192-256

Column0 id page3: 16 contiguous little-endian Int32 values 48..63, exactly 64 bytes. Nullable(NoNull(Flat32)) uses page buffer0 and no validity, compression or padding. Logical row interval [48,64); stored priority0 is unused by this V2_0 encoder, not the row start.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:192-256. Interpretation: rust/lance-file/test_data/exact_versions/datagen.rs:37-42; protos/encodings_v2_0.proto:63-80; protos/encodings_v2_0.proto:174-188. SHA-256: `727ac04fcb71f0630faae36208efabbfbd96e2bc7131bf5ac688b3adc7e8260e`.

### Bytes 256-320

Column0 id page4: 16 contiguous little-endian Int32 values 64..79, exactly 64 bytes. Nullable(NoNull(Flat32)) uses page buffer0 and no validity, compression or padding. Logical row interval [64,80); stored priority0 is unused by this V2_0 encoder, not the row start.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:256-320. Interpretation: rust/lance-file/test_data/exact_versions/datagen.rs:37-42; protos/encodings_v2_0.proto:63-80; protos/encodings_v2_0.proto:174-188. SHA-256: `011ff2a0ea8954419f902e833a5cc73f65ff4807c01376e5c94f566a1b3ee8db`.

### Bytes 320-384

Column0 id page5: 16 contiguous little-endian Int32 values 80..95, exactly 64 bytes. Nullable(NoNull(Flat32)) uses page buffer0 and no validity, compression or padding. Logical row interval [80,96); stored priority0 is unused by this V2_0 encoder, not the row start.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:320-384. Interpretation: rust/lance-file/test_data/exact_versions/datagen.rs:37-42; protos/encodings_v2_0.proto:63-80; protos/encodings_v2_0.proto:174-188. SHA-256: `6a063faec7ebdb5d6b27dce27518d1afa6f47c4f74023b528715a42c3e802018`.

### Bytes 384-448

Column0 id page6: 16 contiguous little-endian Int32 values 96..111, exactly 64 bytes. Nullable(NoNull(Flat32)) uses page buffer0 and no validity, compression or padding. Logical row interval [96,112); stored priority0 is unused by this V2_0 encoder, not the row start.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:384-448. Interpretation: rust/lance-file/test_data/exact_versions/datagen.rs:37-42; protos/encodings_v2_0.proto:63-80; protos/encodings_v2_0.proto:174-188. SHA-256: `2e59d27a9d02426e0b911e25fcf1b08a56876b6bced33824ddbde368f5aaec3c`.

### Bytes 448-512

Column0 id page7: 16 contiguous little-endian Int32 values 112..127, exactly 64 bytes. Nullable(NoNull(Flat32)) uses page buffer0 and no validity, compression or padding. Logical row interval [112,128); stored priority0 is unused by this V2_0 encoder, not the row start.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:448-512. Interpretation: rust/lance-file/test_data/exact_versions/datagen.rs:37-42; protos/encodings_v2_0.proto:63-80; protos/encodings_v2_0.proto:174-188. SHA-256: `7b2e68201fc43717fa63533b7a127984c989df25cbf207e55fec1a6e731e4175`.

### Bytes 512-576

Column0 id page8: 16 contiguous little-endian Int32 values 128..143, exactly 64 bytes. Nullable(NoNull(Flat32)) uses page buffer0 and no validity, compression or padding. Logical row interval [128,144); stored priority0 is unused by this V2_0 encoder, not the row start.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:512-576. Interpretation: rust/lance-file/test_data/exact_versions/datagen.rs:37-42; protos/encodings_v2_0.proto:63-80; protos/encodings_v2_0.proto:174-188. SHA-256: `7b040a65bef66ef68032e7bb074095ffe2be0c3ce40464b3cd0e43467d35e20e`.

### Bytes 576-640

Column0 id page9: 16 contiguous little-endian Int32 values 144..159, exactly 64 bytes. Nullable(NoNull(Flat32)) uses page buffer0 and no validity, compression or padding. Logical row interval [144,160); stored priority0 is unused by this V2_0 encoder, not the row start.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:576-640. Interpretation: rust/lance-file/test_data/exact_versions/datagen.rs:37-42; protos/encodings_v2_0.proto:63-80; protos/encodings_v2_0.proto:174-188. SHA-256: `d32d055d3a1e5e0ce8deb870042ba5c267038c604c69d2a32279bfbcf4373945`.

### Bytes 640-704

Column0 id page10: 16 contiguous little-endian Int32 values 160..175, exactly 64 bytes. Nullable(NoNull(Flat32)) uses page buffer0 and no validity, compression or padding. Logical row interval [160,176); stored priority0 is unused by this V2_0 encoder, not the row start.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:640-704. Interpretation: rust/lance-file/test_data/exact_versions/datagen.rs:37-42; protos/encodings_v2_0.proto:63-80; protos/encodings_v2_0.proto:174-188. SHA-256: `881f7818d633348f0780884e19593a8202c010489bd5c6289db8437bdc1f501c`.

### Bytes 704-768

Column0 id page11: 16 contiguous little-endian Int32 values 176..191, exactly 64 bytes. Nullable(NoNull(Flat32)) uses page buffer0 and no validity, compression or padding. Logical row interval [176,192); stored priority0 is unused by this V2_0 encoder, not the row start.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:704-768. Interpretation: rust/lance-file/test_data/exact_versions/datagen.rs:37-42; protos/encodings_v2_0.proto:63-80; protos/encodings_v2_0.proto:174-188. SHA-256: `6629741f727ba2eb7a58cff902dafb30d68c7707f3d6742fc8b0c3eb93847282`.

### Bytes 768-832

Column0 id page12: 16 contiguous little-endian Int32 values 192..207, exactly 64 bytes. Nullable(NoNull(Flat32)) uses page buffer0 and no validity, compression or padding. Logical row interval [192,208); stored priority0 is unused by this V2_0 encoder, not the row start.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:768-832. Interpretation: rust/lance-file/test_data/exact_versions/datagen.rs:37-42; protos/encodings_v2_0.proto:63-80; protos/encodings_v2_0.proto:174-188. SHA-256: `ea051d83522fcbf70ba8b1c97fc1ec448f3c004518fa6a934e70e17a307a269f`.

### Bytes 832-896

Column0 id page13: 16 contiguous little-endian Int32 values 208..223, exactly 64 bytes. Nullable(NoNull(Flat32)) uses page buffer0 and no validity, compression or padding. Logical row interval [208,224); stored priority0 is unused by this V2_0 encoder, not the row start.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:832-896. Interpretation: rust/lance-file/test_data/exact_versions/datagen.rs:37-42; protos/encodings_v2_0.proto:63-80; protos/encodings_v2_0.proto:174-188. SHA-256: `67c447b682006c8088a841e0a691565fd9742c68502a1401e65b33f0dbe61072`.

### Bytes 896-960

Column0 id page14: 16 contiguous little-endian Int32 values 224..239, exactly 64 bytes. Nullable(NoNull(Flat32)) uses page buffer0 and no validity, compression or padding. Logical row interval [224,240); stored priority0 is unused by this V2_0 encoder, not the row start.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:896-960. Interpretation: rust/lance-file/test_data/exact_versions/datagen.rs:37-42; protos/encodings_v2_0.proto:63-80; protos/encodings_v2_0.proto:174-188. SHA-256: `e9f0470ee319de045794932b7ab07fbd7ede592c79de67e69f913820130b1197`.

### Bytes 960-1024

Column0 id page15: 16 contiguous little-endian Int32 values 240..255, exactly 64 bytes. Nullable(NoNull(Flat32)) uses page buffer0 and no validity, compression or padding. Logical row interval [240,256); stored priority0 is unused by this V2_0 encoder, not the row start.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:960-1024. Interpretation: rust/lance-file/test_data/exact_versions/datagen.rs:37-42; protos/encodings_v2_0.proto:63-80; protos/encodings_v2_0.proto:174-188. SHA-256: `e317830a654587f074227babd0fb754558d3825c19d5870025b0d41879b67994`.

### Bytes 1024-1028

Column0 id page16: 1 contiguous little-endian Int32 values 256..256, exactly 4 bytes. Nullable(NoNull(Flat32)) uses page buffer0 and no validity, compression or padding. Logical row interval [256,257); stored priority0 is unused by this V2_0 encoder, not the row start.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:1024-1028. Interpretation: rust/lance-file/test_data/exact_versions/datagen.rs:37-42; protos/encodings_v2_0.proto:63-80; protos/encodings_v2_0.proto:174-188. SHA-256: `bf5e8ffa51a9e748985800c1d3d7f1a2a6ae7435136593ca8d9637e3f87c699c`.

### Bytes 1028-1076

Column1 name page0, rows[0,2): 16 bytes at1028 store 2 little-endian UInt64 cumulative end offsets [33,32]. Binary null_adjustment=33; subtract it from raw values >=33, yielding [0,32]. Buffer1 at1044 contains 32 concatenated ASCII bytes for null / "value-0001-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:1028-1076. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `d24063023592a669e636062006b3149640f955134a58f81f5899a0172d7f6b71`.

### Bytes 1076-1156

Column1 name page1, rows[2,4): 16 bytes at1076 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at1092 contains 64 concatenated ASCII bytes for "value-0002-deterministic-fixture" / "value-0003-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:1076-1156. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `f1a11d53141d70026a1841718c2a73fda9f5b038e720634aec5b4571865f0afc`.

### Bytes 1156-1236

Column1 name page2, rows[4,6): 16 bytes at1156 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at1172 contains 64 concatenated ASCII bytes for "value-0004-deterministic-fixture" / "value-0005-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:1156-1236. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `03ecb2e2dad3f31e5229718faec15909bb51ae29c18d3a1c0fd3253a19bda824`.

### Bytes 1236-1284

Column1 name page3, rows[6,8): 16 bytes at1236 store 2 little-endian UInt64 cumulative end offsets [32,65]. Binary null_adjustment=33; subtract it from raw values >=33, yielding [32,32]. Buffer1 at1252 contains 32 concatenated ASCII bytes for "value-0006-deterministic-fixture" / null; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:1236-1284. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `1eac19918f38ebcd319f211d7016e64d1040ba8e89280a7fb6ad9fb5d33bddf0`.

### Bytes 1284-1364

Column1 name page4, rows[8,10): 16 bytes at1284 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at1300 contains 64 concatenated ASCII bytes for "value-0008-deterministic-fixture" / "value-0009-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:1284-1364. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `a658b5c0142a17ca3d97592653d9f811e1daa519400414b9522fdda090791557`.

### Bytes 1364-1444

Column1 name page5, rows[10,12): 16 bytes at1364 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at1380 contains 64 concatenated ASCII bytes for "value-0010-deterministic-fixture" / "value-0011-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:1364-1444. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `6fcb26bfa5838e5b528e414bdc4c3988229d74941a0896eae2c76d89b562f734`.

### Bytes 1444-1524

Column1 name page6, rows[12,14): 16 bytes at1444 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at1460 contains 64 concatenated ASCII bytes for "value-0012-deterministic-fixture" / "value-0013-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:1444-1524. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `fbd5f88a0457660d5cfad12de0e4d4e4eb4f3ddec0d59482807075df3d904c0a`.

### Bytes 1524-1572

Column1 name page7, rows[14,16): 16 bytes at1524 store 2 little-endian UInt64 cumulative end offsets [33,32]. Binary null_adjustment=33; subtract it from raw values >=33, yielding [0,32]. Buffer1 at1540 contains 32 concatenated ASCII bytes for null / "value-0015-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:1524-1572. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `fe919e901bcb726f28285003c3e02ee19ffb0d2718bc66865f48d03d51888f15`.

### Bytes 1572-1652

Column1 name page8, rows[16,18): 16 bytes at1572 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at1588 contains 64 concatenated ASCII bytes for "value-0016-deterministic-fixture" / "value-0017-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:1572-1652. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `3566b008465145be9d9efbc675c9f29181ffd11821077bdc193ef377ecd0fc8b`.

### Bytes 1652-1732

Column1 name page9, rows[18,20): 16 bytes at1652 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at1668 contains 64 concatenated ASCII bytes for "value-0018-deterministic-fixture" / "value-0019-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:1652-1732. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `f33bb1c263ee267e8c61cec2156f47a34f7cf2e97f65297439918a5a1c44295a`.

### Bytes 1732-1780

Column1 name page10, rows[20,22): 16 bytes at1732 store 2 little-endian UInt64 cumulative end offsets [32,65]. Binary null_adjustment=33; subtract it from raw values >=33, yielding [32,32]. Buffer1 at1748 contains 32 concatenated ASCII bytes for "value-0020-deterministic-fixture" / null; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:1732-1780. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `4fc3ac879e9215f45cbb67756ad6aa3961172124f39b9d763fa0ddeab45c07e9`.

### Bytes 1780-1860

Column1 name page11, rows[22,24): 16 bytes at1780 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at1796 contains 64 concatenated ASCII bytes for "value-0022-deterministic-fixture" / "value-0023-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:1780-1860. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `2dad319eb8da5389ee157f5d76ac2a12ee3a70aa47921cda5648a2ac605456b9`.

### Bytes 1860-1940

Column1 name page12, rows[24,26): 16 bytes at1860 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at1876 contains 64 concatenated ASCII bytes for "value-0024-deterministic-fixture" / "value-0025-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:1860-1940. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `7043b87e62df8b80fe8f3669d5fb46c9a9ae445ba31abfb6f092717e55f99a40`.

### Bytes 1940-2020

Column1 name page13, rows[26,28): 16 bytes at1940 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at1956 contains 64 concatenated ASCII bytes for "value-0026-deterministic-fixture" / "value-0027-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:1940-2020. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `0545d63b6b7c51d2665d7cddfb16bd762cc12768d8f096c4cb09286cb72d2c5a`.

### Bytes 2020-2068

Column1 name page14, rows[28,30): 16 bytes at2020 store 2 little-endian UInt64 cumulative end offsets [33,32]. Binary null_adjustment=33; subtract it from raw values >=33, yielding [0,32]. Buffer1 at2036 contains 32 concatenated ASCII bytes for null / "value-0029-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:2020-2068. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `e7d401e7efc932b4200c6779237e35ba274954efed68ed2e4e3a442ebc85765f`.

### Bytes 2068-2148

Column1 name page15, rows[30,32): 16 bytes at2068 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at2084 contains 64 concatenated ASCII bytes for "value-0030-deterministic-fixture" / "value-0031-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:2068-2148. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `3f5125e1a609d48ae7b50e1a43718355dffeb29553f8d5800825ba91b378f394`.

### Bytes 2148-2228

Column1 name page16, rows[32,34): 16 bytes at2148 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at2164 contains 64 concatenated ASCII bytes for "value-0032-deterministic-fixture" / "value-0033-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:2148-2228. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `41f62af2f59020cba1587ddab1cb5b865c518bb9c10233ccf821d0f6aade2659`.

### Bytes 2228-2276

Column1 name page17, rows[34,36): 16 bytes at2228 store 2 little-endian UInt64 cumulative end offsets [32,65]. Binary null_adjustment=33; subtract it from raw values >=33, yielding [32,32]. Buffer1 at2244 contains 32 concatenated ASCII bytes for "value-0034-deterministic-fixture" / null; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:2228-2276. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `e047fcd89405c257fe199b7fd3d420ad2a7fa4f4b60d09c44b9a1710ec2e7422`.

### Bytes 2276-2356

Column1 name page18, rows[36,38): 16 bytes at2276 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at2292 contains 64 concatenated ASCII bytes for "value-0036-deterministic-fixture" / "value-0037-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:2276-2356. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `f8f4638855404f5d9917a17f5beb43cd4cb289630af32ca76bd11fd00872e470`.

### Bytes 2356-2436

Column1 name page19, rows[38,40): 16 bytes at2356 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at2372 contains 64 concatenated ASCII bytes for "value-0038-deterministic-fixture" / "value-0039-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:2356-2436. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `ae96ca86a726c5389d889bb3163faaec660c53fb6c2e267462deab69a8d65f66`.

### Bytes 2436-2516

Column1 name page20, rows[40,42): 16 bytes at2436 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at2452 contains 64 concatenated ASCII bytes for "value-0040-deterministic-fixture" / "value-0041-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:2436-2516. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `ff56f13c0856c2459b1f0d1b550858962c78f5eea1a97e2401e7ecb4dbf16562`.

### Bytes 2516-2564

Column1 name page21, rows[42,44): 16 bytes at2516 store 2 little-endian UInt64 cumulative end offsets [33,32]. Binary null_adjustment=33; subtract it from raw values >=33, yielding [0,32]. Buffer1 at2532 contains 32 concatenated ASCII bytes for null / "value-0043-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:2516-2564. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `f05ef638107328391630fb89f210445a61b2f35edb1c2a37be95b7175bad0f31`.

### Bytes 2564-2644

Column1 name page22, rows[44,46): 16 bytes at2564 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at2580 contains 64 concatenated ASCII bytes for "value-0044-deterministic-fixture" / "value-0045-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:2564-2644. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `3160ef4af182c373c8e41945b8a11cf62732851f9ee72722c3509fe622ab0a07`.

### Bytes 2644-2724

Column1 name page23, rows[46,48): 16 bytes at2644 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at2660 contains 64 concatenated ASCII bytes for "value-0046-deterministic-fixture" / "value-0047-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:2644-2724. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `73f22d42361e5dc84f9c59f750c69995f20f61106fd7e2005763e96f789305f7`.

### Bytes 2724-2772

Column1 name page24, rows[48,50): 16 bytes at2724 store 2 little-endian UInt64 cumulative end offsets [32,65]. Binary null_adjustment=33; subtract it from raw values >=33, yielding [32,32]. Buffer1 at2740 contains 32 concatenated ASCII bytes for "value-0048-deterministic-fixture" / null; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:2724-2772. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `94a442c305eb2090bf9b3f487bad3450dbfc5857ed088a2896e34aa75bcbe8ac`.

### Bytes 2772-2852

Column1 name page25, rows[50,52): 16 bytes at2772 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at2788 contains 64 concatenated ASCII bytes for "value-0050-deterministic-fixture" / "value-0051-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:2772-2852. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `161606487c8b2033619f50fbf90237acb9bd1cff59aafe785128489e7615f07c`.

### Bytes 2852-2932

Column1 name page26, rows[52,54): 16 bytes at2852 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at2868 contains 64 concatenated ASCII bytes for "value-0052-deterministic-fixture" / "value-0053-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:2852-2932. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `052c9b722ab65395600f95e46c624e4c46ed1cdae7da7a2cb3710533b77700fa`.

### Bytes 2932-3012

Column1 name page27, rows[54,56): 16 bytes at2932 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at2948 contains 64 concatenated ASCII bytes for "value-0054-deterministic-fixture" / "value-0055-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:2932-3012. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `4e41481db657a9dc15f445ebef8a15b71e9bfa8c3d241bfa8e292722804edfec`.

### Bytes 3012-3060

Column1 name page28, rows[56,58): 16 bytes at3012 store 2 little-endian UInt64 cumulative end offsets [33,32]. Binary null_adjustment=33; subtract it from raw values >=33, yielding [0,32]. Buffer1 at3028 contains 32 concatenated ASCII bytes for null / "value-0057-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:3012-3060. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `25ac1f4439270c7784f1cf8edd24c6916501efb2c9f9bb6ec468ae046936c964`.

### Bytes 3060-3140

Column1 name page29, rows[58,60): 16 bytes at3060 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at3076 contains 64 concatenated ASCII bytes for "value-0058-deterministic-fixture" / "value-0059-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:3060-3140. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `124a3e654f64d2d0d8143ae645fc285bee943333ae000cb842e267c0d2ada216`.

### Bytes 3140-3220

Column1 name page30, rows[60,62): 16 bytes at3140 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at3156 contains 64 concatenated ASCII bytes for "value-0060-deterministic-fixture" / "value-0061-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:3140-3220. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `fa310f89f95261c5ea443d6e502e82c9e3e8baebfff5c1d7972fbdedd6944c75`.

### Bytes 3220-3268

Column1 name page31, rows[62,64): 16 bytes at3220 store 2 little-endian UInt64 cumulative end offsets [32,65]. Binary null_adjustment=33; subtract it from raw values >=33, yielding [32,32]. Buffer1 at3236 contains 32 concatenated ASCII bytes for "value-0062-deterministic-fixture" / null; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:3220-3268. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `9a65d62ad5cf087a961c58565ab64f7072650f8c3edef6f50e27d3f72dcced7c`.

### Bytes 3268-3348

Column1 name page32, rows[64,66): 16 bytes at3268 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at3284 contains 64 concatenated ASCII bytes for "value-0064-deterministic-fixture" / "value-0065-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:3268-3348. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `9b228ec4157541a1e63fb81cbd74a70582ce5bf2ccfed9196ed1593116cd935f`.

### Bytes 3348-3428

Column1 name page33, rows[66,68): 16 bytes at3348 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at3364 contains 64 concatenated ASCII bytes for "value-0066-deterministic-fixture" / "value-0067-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:3348-3428. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `77b49f67eccfa96f9a2ca8ae2b36c2b2b6e94e571609b19645954d0a37c5b1b6`.

### Bytes 3428-3508

Column1 name page34, rows[68,70): 16 bytes at3428 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at3444 contains 64 concatenated ASCII bytes for "value-0068-deterministic-fixture" / "value-0069-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:3428-3508. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `9166f139b29c8dc34a552e9e7ef383ae2de1efdd4596ef47675bebb23672e0f8`.

### Bytes 3508-3556

Column1 name page35, rows[70,72): 16 bytes at3508 store 2 little-endian UInt64 cumulative end offsets [33,32]. Binary null_adjustment=33; subtract it from raw values >=33, yielding [0,32]. Buffer1 at3524 contains 32 concatenated ASCII bytes for null / "value-0071-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:3508-3556. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `4b3e25017db170a6a63a95b7ae08e1db13ffcaaa6327ef2dc807df6348b09fcd`.

### Bytes 3556-3636

Column1 name page36, rows[72,74): 16 bytes at3556 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at3572 contains 64 concatenated ASCII bytes for "value-0072-deterministic-fixture" / "value-0073-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:3556-3636. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `b0ae336dcd5956854e73ad5314a1d22d09171e9af27c31f235dda19a7b217097`.

### Bytes 3636-3716

Column1 name page37, rows[74,76): 16 bytes at3636 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at3652 contains 64 concatenated ASCII bytes for "value-0074-deterministic-fixture" / "value-0075-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:3636-3716. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `78f022c4f4a36f5626e1ed7d385bf2499ad015fbfc2d02bf7357ee41c4248a9a`.

### Bytes 3716-3764

Column1 name page38, rows[76,78): 16 bytes at3716 store 2 little-endian UInt64 cumulative end offsets [32,65]. Binary null_adjustment=33; subtract it from raw values >=33, yielding [32,32]. Buffer1 at3732 contains 32 concatenated ASCII bytes for "value-0076-deterministic-fixture" / null; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:3716-3764. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `22b221afb8892f74657f4df07929f408f7a98ed0bcdb9588f47f2269805e02d1`.

### Bytes 3764-3844

Column1 name page39, rows[78,80): 16 bytes at3764 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at3780 contains 64 concatenated ASCII bytes for "value-0078-deterministic-fixture" / "value-0079-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:3764-3844. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `5b4e4bf773808e24ce743b907899fc08fc569328c95761190db60ac634d80bfb`.

### Bytes 3844-3924

Column1 name page40, rows[80,82): 16 bytes at3844 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at3860 contains 64 concatenated ASCII bytes for "value-0080-deterministic-fixture" / "value-0081-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:3844-3924. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `df129496d2b427071d0363a27747553587c68a3f2fefad39c13cb2e10227e7f4`.

### Bytes 3924-4004

Column1 name page41, rows[82,84): 16 bytes at3924 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at3940 contains 64 concatenated ASCII bytes for "value-0082-deterministic-fixture" / "value-0083-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:3924-4004. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `6b6f87fa9d5d1ca3a55b84678bc341164083b3d710f9f13301bfe1d2d68b656a`.

### Bytes 4004-4052

Column1 name page42, rows[84,86): 16 bytes at4004 store 2 little-endian UInt64 cumulative end offsets [33,32]. Binary null_adjustment=33; subtract it from raw values >=33, yielding [0,32]. Buffer1 at4020 contains 32 concatenated ASCII bytes for null / "value-0085-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:4004-4052. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `bc13568f9504053a5d779e115e920f801d28e8c477495823067a3df515ab3a18`.

### Bytes 4052-4132

Column1 name page43, rows[86,88): 16 bytes at4052 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at4068 contains 64 concatenated ASCII bytes for "value-0086-deterministic-fixture" / "value-0087-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:4052-4132. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `960caab19d74d5c6af4649ab611eeb61b0f0cb3cb9f00b18b6315abb47a20850`.

### Bytes 4132-4212

Column1 name page44, rows[88,90): 16 bytes at4132 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at4148 contains 64 concatenated ASCII bytes for "value-0088-deterministic-fixture" / "value-0089-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:4132-4212. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `10f1ad56d0fa05688ec9fefeac886082b9c18c2327a844371d8cbda57bf7b224`.

### Bytes 4212-4260

Column1 name page45, rows[90,92): 16 bytes at4212 store 2 little-endian UInt64 cumulative end offsets [32,65]. Binary null_adjustment=33; subtract it from raw values >=33, yielding [32,32]. Buffer1 at4228 contains 32 concatenated ASCII bytes for "value-0090-deterministic-fixture" / null; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:4212-4260. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `77a33834be8e6c819b7f74a6187271edeae9754c9adddaa0ca70a3cdca30ab50`.

### Bytes 4260-4340

Column1 name page46, rows[92,94): 16 bytes at4260 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at4276 contains 64 concatenated ASCII bytes for "value-0092-deterministic-fixture" / "value-0093-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:4260-4340. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `2ae5d2065188c90f16b1a84bf884e0ebd6698acee330838a835299c037c54ba8`.

### Bytes 4340-4420

Column1 name page47, rows[94,96): 16 bytes at4340 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at4356 contains 64 concatenated ASCII bytes for "value-0094-deterministic-fixture" / "value-0095-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:4340-4420. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `654d550d1b0ff3f895e44273ab6b76b0396c0249752a41aa30797813af93b234`.

### Bytes 4420-4500

Column1 name page48, rows[96,98): 16 bytes at4420 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at4436 contains 64 concatenated ASCII bytes for "value-0096-deterministic-fixture" / "value-0097-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:4420-4500. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `9119d5a45bfeacf956bcadf5438b094f93938786f4a4cea9be48dc0593918775`.

### Bytes 4500-4548

Column1 name page49, rows[98,100): 16 bytes at4500 store 2 little-endian UInt64 cumulative end offsets [33,32]. Binary null_adjustment=33; subtract it from raw values >=33, yielding [0,32]. Buffer1 at4516 contains 32 concatenated ASCII bytes for null / "value-0099-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:4500-4548. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `bfb9ccc0d93d1081b6f29e8bd6aa963671d81aa80d0e9d733e463d2420aecc8d`.

### Bytes 4548-4628

Column1 name page50, rows[100,102): 16 bytes at4548 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at4564 contains 64 concatenated ASCII bytes for "value-0100-deterministic-fixture" / "value-0101-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:4548-4628. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `82630d0661ec5695843b5bd05eedde0a3ab858962b3ddc91ade2d8b7e21306d1`.

### Bytes 4628-4708

Column1 name page51, rows[102,104): 16 bytes at4628 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at4644 contains 64 concatenated ASCII bytes for "value-0102-deterministic-fixture" / "value-0103-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:4628-4708. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `6b238821e83af58c85c94f287a3c1ab8d763a19c60d72080c351538a51663f27`.

### Bytes 4708-4756

Column1 name page52, rows[104,106): 16 bytes at4708 store 2 little-endian UInt64 cumulative end offsets [32,65]. Binary null_adjustment=33; subtract it from raw values >=33, yielding [32,32]. Buffer1 at4724 contains 32 concatenated ASCII bytes for "value-0104-deterministic-fixture" / null; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:4708-4756. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `6e5e9394023b54b217311bb2e2f663d35272d2d875c7b2e573318ef8460da5b3`.

### Bytes 4756-4836

Column1 name page53, rows[106,108): 16 bytes at4756 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at4772 contains 64 concatenated ASCII bytes for "value-0106-deterministic-fixture" / "value-0107-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:4756-4836. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `56a0a019670408a69d5157e940d8ebd0f02e1ee81d64967f53a124d516ac7002`.

### Bytes 4836-4916

Column1 name page54, rows[108,110): 16 bytes at4836 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at4852 contains 64 concatenated ASCII bytes for "value-0108-deterministic-fixture" / "value-0109-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:4836-4916. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `0f75cf75913a562678b6f9e81b1a538190e9b0bed6d8b6912580351cd12f3543`.

### Bytes 4916-4996

Column1 name page55, rows[110,112): 16 bytes at4916 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at4932 contains 64 concatenated ASCII bytes for "value-0110-deterministic-fixture" / "value-0111-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:4916-4996. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `898180784dfa3e0a099530b8c611ab6f37983403b88b81cabff6987fea7e3640`.

### Bytes 4996-5044

Column1 name page56, rows[112,114): 16 bytes at4996 store 2 little-endian UInt64 cumulative end offsets [33,32]. Binary null_adjustment=33; subtract it from raw values >=33, yielding [0,32]. Buffer1 at5012 contains 32 concatenated ASCII bytes for null / "value-0113-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:4996-5044. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `f9e5f8506d061fb34be3698f06ad47349d53347af136ac094b9ddef279abf285`.

### Bytes 5044-5124

Column1 name page57, rows[114,116): 16 bytes at5044 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at5060 contains 64 concatenated ASCII bytes for "value-0114-deterministic-fixture" / "value-0115-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:5044-5124. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `741567ee13ff15987ac991305ff4b0f2e5ab3285a761a63c4f2a4a0faf3564dd`.

### Bytes 5124-5204

Column1 name page58, rows[116,118): 16 bytes at5124 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at5140 contains 64 concatenated ASCII bytes for "value-0116-deterministic-fixture" / "value-0117-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:5124-5204. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `a80d35dc08e1237b9d8cbed461c096e14954ee6f9fee7b79e58125c2f8a5e2c0`.

### Bytes 5204-5252

Column1 name page59, rows[118,120): 16 bytes at5204 store 2 little-endian UInt64 cumulative end offsets [32,65]. Binary null_adjustment=33; subtract it from raw values >=33, yielding [32,32]. Buffer1 at5220 contains 32 concatenated ASCII bytes for "value-0118-deterministic-fixture" / null; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:5204-5252. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `4508317e2ce669b393a0a5d54669628f576240a14bc84dc4a44aa93c4b048a92`.

### Bytes 5252-5332

Column1 name page60, rows[120,122): 16 bytes at5252 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at5268 contains 64 concatenated ASCII bytes for "value-0120-deterministic-fixture" / "value-0121-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:5252-5332. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `a679544d1da5f91b18f70b2ea8eeaf640680481872e5c2c5be216b2480af7652`.

### Bytes 5332-5412

Column1 name page61, rows[122,124): 16 bytes at5332 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at5348 contains 64 concatenated ASCII bytes for "value-0122-deterministic-fixture" / "value-0123-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:5332-5412. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `f0b5e47f6253dd726aea4454e98aa9ad324e3056521f8ccba6a2be76f8b8e807`.

### Bytes 5412-5492

Column1 name page62, rows[124,126): 16 bytes at5412 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at5428 contains 64 concatenated ASCII bytes for "value-0124-deterministic-fixture" / "value-0125-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:5412-5492. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `3e52fc31f08ac3887d9b7eae9837af200ddf91e31fa2ad9baa55aa7bbce65288`.

### Bytes 5492-5540

Column1 name page63, rows[126,128): 16 bytes at5492 store 2 little-endian UInt64 cumulative end offsets [33,32]. Binary null_adjustment=33; subtract it from raw values >=33, yielding [0,32]. Buffer1 at5508 contains 32 concatenated ASCII bytes for null / "value-0127-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:5492-5540. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `393e9f1489f257ec7b47be95009a0a39865577fed1feb5278092c613e3c7349c`.

### Bytes 5540-5620

Column1 name page64, rows[128,130): 16 bytes at5540 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at5556 contains 64 concatenated ASCII bytes for "value-0128-deterministic-fixture" / "value-0129-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:5540-5620. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `035d16d2560d2de1521bb8f42516b13b8ab927444046e88c9d440a9b095258e0`.

### Bytes 5620-5700

Column1 name page65, rows[130,132): 16 bytes at5620 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at5636 contains 64 concatenated ASCII bytes for "value-0130-deterministic-fixture" / "value-0131-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:5620-5700. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `5084b5130641b96cda70241816a750198663e58c2bc5a312be605e4b151f7a42`.

### Bytes 5700-5748

Column1 name page66, rows[132,134): 16 bytes at5700 store 2 little-endian UInt64 cumulative end offsets [32,65]. Binary null_adjustment=33; subtract it from raw values >=33, yielding [32,32]. Buffer1 at5716 contains 32 concatenated ASCII bytes for "value-0132-deterministic-fixture" / null; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:5700-5748. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `0cce3ed5a71b999b194bb7dedc203eed575f583198b969f6646e979650f5b6f6`.

### Bytes 5748-5828

Column1 name page67, rows[134,136): 16 bytes at5748 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at5764 contains 64 concatenated ASCII bytes for "value-0134-deterministic-fixture" / "value-0135-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:5748-5828. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `45deef77349e732763501a31b041f01433eadd1e16524e9aa9fc0ff5101a2c3c`.

### Bytes 5828-5908

Column1 name page68, rows[136,138): 16 bytes at5828 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at5844 contains 64 concatenated ASCII bytes for "value-0136-deterministic-fixture" / "value-0137-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:5828-5908. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `e7af99af1065c5fc18a1209d14a3d643a02b1d609e4ca0cf7284dcd98b566c29`.

### Bytes 5908-5988

Column1 name page69, rows[138,140): 16 bytes at5908 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at5924 contains 64 concatenated ASCII bytes for "value-0138-deterministic-fixture" / "value-0139-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:5908-5988. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `72be1f34803412c8e1c95e011b32c44031f95bc3ef6ea28017b09cb39630d828`.

### Bytes 5988-6036

Column1 name page70, rows[140,142): 16 bytes at5988 store 2 little-endian UInt64 cumulative end offsets [33,32]. Binary null_adjustment=33; subtract it from raw values >=33, yielding [0,32]. Buffer1 at6004 contains 32 concatenated ASCII bytes for null / "value-0141-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:5988-6036. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `57c89cf2d3661d75343900049cb6d0a1b246ac30c4311b1aeba2085b9b3ba90b`.

### Bytes 6036-6116

Column1 name page71, rows[142,144): 16 bytes at6036 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at6052 contains 64 concatenated ASCII bytes for "value-0142-deterministic-fixture" / "value-0143-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:6036-6116. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `591b46ff70f31af507f36bfc1e4391e3501306c820b15f516c368e9c9d465696`.

### Bytes 6116-6196

Column1 name page72, rows[144,146): 16 bytes at6116 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at6132 contains 64 concatenated ASCII bytes for "value-0144-deterministic-fixture" / "value-0145-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:6116-6196. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `9bcc41f158a04e07f0855a47f969faf87a48141307ba0ea77ca125908e6a3411`.

### Bytes 6196-6244

Column1 name page73, rows[146,148): 16 bytes at6196 store 2 little-endian UInt64 cumulative end offsets [32,65]. Binary null_adjustment=33; subtract it from raw values >=33, yielding [32,32]. Buffer1 at6212 contains 32 concatenated ASCII bytes for "value-0146-deterministic-fixture" / null; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:6196-6244. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `30e0511069765fa108a34f30e459579bbf9feeb9f109fd8e5397b6b1cf1d72d8`.

### Bytes 6244-6324

Column1 name page74, rows[148,150): 16 bytes at6244 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at6260 contains 64 concatenated ASCII bytes for "value-0148-deterministic-fixture" / "value-0149-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:6244-6324. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `3837156937926969b3a77d6af0635991568f66de062caf52a89ee537269d7ce8`.

### Bytes 6324-6404

Column1 name page75, rows[150,152): 16 bytes at6324 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at6340 contains 64 concatenated ASCII bytes for "value-0150-deterministic-fixture" / "value-0151-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:6324-6404. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `71f379acd8a19f9af278353505e89e9757401851031e8e963066c7357e4dede2`.

### Bytes 6404-6484

Column1 name page76, rows[152,154): 16 bytes at6404 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at6420 contains 64 concatenated ASCII bytes for "value-0152-deterministic-fixture" / "value-0153-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:6404-6484. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `55dd8272df058b98d1f023834620943d2279b15a97f557f5215181a12eb86712`.

### Bytes 6484-6532

Column1 name page77, rows[154,156): 16 bytes at6484 store 2 little-endian UInt64 cumulative end offsets [33,32]. Binary null_adjustment=33; subtract it from raw values >=33, yielding [0,32]. Buffer1 at6500 contains 32 concatenated ASCII bytes for null / "value-0155-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:6484-6532. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `fb83ec97834d468aa8fa3ec85eca344f8d44deea27823ad816f083b4de7a1da0`.

### Bytes 6532-6612

Column1 name page78, rows[156,158): 16 bytes at6532 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at6548 contains 64 concatenated ASCII bytes for "value-0156-deterministic-fixture" / "value-0157-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:6532-6612. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `545109bb159e3efbe79f7aebc84bc0f4b2472828bdf64fb1f190eae14dc7d6db`.

### Bytes 6612-6692

Column1 name page79, rows[158,160): 16 bytes at6612 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at6628 contains 64 concatenated ASCII bytes for "value-0158-deterministic-fixture" / "value-0159-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:6612-6692. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `d6dff7b6623d33349b1be57370cc32beb80ea99f183660cee5cf734d46c2d7cb`.

### Bytes 6692-6740

Column1 name page80, rows[160,162): 16 bytes at6692 store 2 little-endian UInt64 cumulative end offsets [32,65]. Binary null_adjustment=33; subtract it from raw values >=33, yielding [32,32]. Buffer1 at6708 contains 32 concatenated ASCII bytes for "value-0160-deterministic-fixture" / null; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:6692-6740. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `9ac109b73c3fb461c95b13dc9bd1f4ca14b55f33caf0133cf3f68209d6a923db`.

### Bytes 6740-6820

Column1 name page81, rows[162,164): 16 bytes at6740 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at6756 contains 64 concatenated ASCII bytes for "value-0162-deterministic-fixture" / "value-0163-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:6740-6820. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `a828fe4edead820ea38769fb68cfbb737d7adf273f183080e2f9accdcee7b3be`.

### Bytes 6820-6900

Column1 name page82, rows[164,166): 16 bytes at6820 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at6836 contains 64 concatenated ASCII bytes for "value-0164-deterministic-fixture" / "value-0165-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:6820-6900. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `47abfcd320deb5fd50019157573db42897a62d7b1a147c3db867a00f57db009b`.

### Bytes 6900-6980

Column1 name page83, rows[166,168): 16 bytes at6900 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at6916 contains 64 concatenated ASCII bytes for "value-0166-deterministic-fixture" / "value-0167-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:6900-6980. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `b35ff11d379152a70a8ecf94cc98072dfbc6719ced9fd202c972b12d8c05592f`.

### Bytes 6980-7028

Column1 name page84, rows[168,170): 16 bytes at6980 store 2 little-endian UInt64 cumulative end offsets [33,32]. Binary null_adjustment=33; subtract it from raw values >=33, yielding [0,32]. Buffer1 at6996 contains 32 concatenated ASCII bytes for null / "value-0169-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:6980-7028. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `90c3f09e30d94f9e103fe0f73c2bec57245eef9443fa4909bd4ad587600e550e`.

### Bytes 7028-7108

Column1 name page85, rows[170,172): 16 bytes at7028 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at7044 contains 64 concatenated ASCII bytes for "value-0170-deterministic-fixture" / "value-0171-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:7028-7108. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `209d9cfb4c918f89304dc1a9db37c08e588de993e5082d93112398376889b3a7`.

### Bytes 7108-7188

Column1 name page86, rows[172,174): 16 bytes at7108 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at7124 contains 64 concatenated ASCII bytes for "value-0172-deterministic-fixture" / "value-0173-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:7108-7188. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `b3799f677a7d615fefa2898ca77aa3cf4bbdbc774e9ee4175b1d2c8115cbb13e`.

### Bytes 7188-7236

Column1 name page87, rows[174,176): 16 bytes at7188 store 2 little-endian UInt64 cumulative end offsets [32,65]. Binary null_adjustment=33; subtract it from raw values >=33, yielding [32,32]. Buffer1 at7204 contains 32 concatenated ASCII bytes for "value-0174-deterministic-fixture" / null; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:7188-7236. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `03e2d69c463882d0044494306d3dd9b4b6034b6438939c110364ca426dac74df`.

### Bytes 7236-7316

Column1 name page88, rows[176,178): 16 bytes at7236 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at7252 contains 64 concatenated ASCII bytes for "value-0176-deterministic-fixture" / "value-0177-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:7236-7316. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `6692f2fc31d535c068a7bdaf0315c91a6f66c952b0f4ef212fe3cd5d371663c5`.

### Bytes 7316-7396

Column1 name page89, rows[178,180): 16 bytes at7316 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at7332 contains 64 concatenated ASCII bytes for "value-0178-deterministic-fixture" / "value-0179-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:7316-7396. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `950f552e08e6bf6ce78403d9530da79770b34b948b6ac23d4ae7138bf165c06b`.

### Bytes 7396-7476

Column1 name page90, rows[180,182): 16 bytes at7396 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at7412 contains 64 concatenated ASCII bytes for "value-0180-deterministic-fixture" / "value-0181-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:7396-7476. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `60a736c07335b5490052f2ba1ea0f46a743efb066bc46aa7b3e8d5149942d004`.

### Bytes 7476-7524

Column1 name page91, rows[182,184): 16 bytes at7476 store 2 little-endian UInt64 cumulative end offsets [33,32]. Binary null_adjustment=33; subtract it from raw values >=33, yielding [0,32]. Buffer1 at7492 contains 32 concatenated ASCII bytes for null / "value-0183-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:7476-7524. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `f025abab5862452dca288883295c11c0f801b28338ec42647c4c4505ce832595`.

### Bytes 7524-7604

Column1 name page92, rows[184,186): 16 bytes at7524 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at7540 contains 64 concatenated ASCII bytes for "value-0184-deterministic-fixture" / "value-0185-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:7524-7604. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `9d44b241b478e629d800dd831c1fef56a91c30d0e3afdd7b74aaf91ef97c7118`.

### Bytes 7604-7684

Column1 name page93, rows[186,188): 16 bytes at7604 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at7620 contains 64 concatenated ASCII bytes for "value-0186-deterministic-fixture" / "value-0187-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:7604-7684. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `2b3666c1689264cd4cad46ca1ca34d690e866faa23f3dc1bff06987de592b33b`.

### Bytes 7684-7732

Column1 name page94, rows[188,190): 16 bytes at7684 store 2 little-endian UInt64 cumulative end offsets [32,65]. Binary null_adjustment=33; subtract it from raw values >=33, yielding [32,32]. Buffer1 at7700 contains 32 concatenated ASCII bytes for "value-0188-deterministic-fixture" / null; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:7684-7732. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `b3110371757daf86ad71b46728084af4c8ed829b5f9475628b023e6ad939a600`.

### Bytes 7732-7812

Column1 name page95, rows[190,192): 16 bytes at7732 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at7748 contains 64 concatenated ASCII bytes for "value-0190-deterministic-fixture" / "value-0191-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:7732-7812. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `7d8d44ae0223de15f98106bc3504f1e01e13f12a1bd7aaf9f9a9653e924ff1dd`.

### Bytes 7812-7892

Column1 name page96, rows[192,194): 16 bytes at7812 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at7828 contains 64 concatenated ASCII bytes for "value-0192-deterministic-fixture" / "value-0193-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:7812-7892. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `31ac8701ead0c6c6b47ff8da66a05f696d36f73944ab87371e4c2cb6f33becbe`.

### Bytes 7892-7972

Column1 name page97, rows[194,196): 16 bytes at7892 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at7908 contains 64 concatenated ASCII bytes for "value-0194-deterministic-fixture" / "value-0195-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:7892-7972. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `39032a4a56f77694643983c8bb9f98b8fe85af3f0cbdbfb5bf58a748f046475c`.

### Bytes 7972-8020

Column1 name page98, rows[196,198): 16 bytes at7972 store 2 little-endian UInt64 cumulative end offsets [33,32]. Binary null_adjustment=33; subtract it from raw values >=33, yielding [0,32]. Buffer1 at7988 contains 32 concatenated ASCII bytes for null / "value-0197-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:7972-8020. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `e01a56f99f0b4da32557bce9db76e3c21143f59ba897648ab3bbebae3be7b6a6`.

### Bytes 8020-8100

Column1 name page99, rows[198,200): 16 bytes at8020 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at8036 contains 64 concatenated ASCII bytes for "value-0198-deterministic-fixture" / "value-0199-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:8020-8100. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `780f45c8fa5edbccdca4eefc5ae8e19ff366c7fd41c66b71990da21451afa388`.

### Bytes 8100-8180

Column1 name page100, rows[200,202): 16 bytes at8100 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at8116 contains 64 concatenated ASCII bytes for "value-0200-deterministic-fixture" / "value-0201-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:8100-8180. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `bc359c9b3db8796495ecbdb9d85fc988acaa437e74df7415f430c36055543e2d`.

### Bytes 8180-8228

Column1 name page101, rows[202,204): 16 bytes at8180 store 2 little-endian UInt64 cumulative end offsets [32,65]. Binary null_adjustment=33; subtract it from raw values >=33, yielding [32,32]. Buffer1 at8196 contains 32 concatenated ASCII bytes for "value-0202-deterministic-fixture" / null; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:8180-8228. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `d14e2d4261bff84140ba6197afb33b1381205cecbda7745f5d2f9180f3b0a6c7`.

### Bytes 8228-8308

Column1 name page102, rows[204,206): 16 bytes at8228 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at8244 contains 64 concatenated ASCII bytes for "value-0204-deterministic-fixture" / "value-0205-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:8228-8308. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `0e7da0b952747cf935f289fc6a3ce2b1d6f8639f6f8ec1f44c6ebe208db37d93`.

### Bytes 8308-8388

Column1 name page103, rows[206,208): 16 bytes at8308 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at8324 contains 64 concatenated ASCII bytes for "value-0206-deterministic-fixture" / "value-0207-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:8308-8388. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `cd079eb8fe4d8e4e68d5338b680058a6543b6b0206ce982f7620591168ee8cc4`.

### Bytes 8388-8468

Column1 name page104, rows[208,210): 16 bytes at8388 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at8404 contains 64 concatenated ASCII bytes for "value-0208-deterministic-fixture" / "value-0209-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:8388-8468. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `7fadcc75831a997b47b5222bfe68610acc5350a2151b516410362622e04bd0f8`.

### Bytes 8468-8516

Column1 name page105, rows[210,212): 16 bytes at8468 store 2 little-endian UInt64 cumulative end offsets [33,32]. Binary null_adjustment=33; subtract it from raw values >=33, yielding [0,32]. Buffer1 at8484 contains 32 concatenated ASCII bytes for null / "value-0211-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:8468-8516. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `245995aa8841b2aaaeeb7f775505f8a4752e78c46fab659a4de49c5de5042ed1`.

### Bytes 8516-8596

Column1 name page106, rows[212,214): 16 bytes at8516 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at8532 contains 64 concatenated ASCII bytes for "value-0212-deterministic-fixture" / "value-0213-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:8516-8596. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `4568b05ec54039e18f285e5385fe96a78f303104b0b8aa5d87b85cb654c6b5f8`.

### Bytes 8596-8676

Column1 name page107, rows[214,216): 16 bytes at8596 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at8612 contains 64 concatenated ASCII bytes for "value-0214-deterministic-fixture" / "value-0215-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:8596-8676. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `9db77bbbc095652046d05de232e9a9b086691838642aa39dd3e1a740bb6e62a6`.

### Bytes 8676-8724

Column1 name page108, rows[216,218): 16 bytes at8676 store 2 little-endian UInt64 cumulative end offsets [32,65]. Binary null_adjustment=33; subtract it from raw values >=33, yielding [32,32]. Buffer1 at8692 contains 32 concatenated ASCII bytes for "value-0216-deterministic-fixture" / null; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:8676-8724. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `5b37172318eec1d076e623aced6f7901b832b6996e42050946e32f716ec9c825`.

### Bytes 8724-8804

Column1 name page109, rows[218,220): 16 bytes at8724 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at8740 contains 64 concatenated ASCII bytes for "value-0218-deterministic-fixture" / "value-0219-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:8724-8804. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `ce09b7827621ac8dd798826f17f628564876f73fa6a106957a8a51abe4e95b8a`.

### Bytes 8804-8884

Column1 name page110, rows[220,222): 16 bytes at8804 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at8820 contains 64 concatenated ASCII bytes for "value-0220-deterministic-fixture" / "value-0221-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:8804-8884. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `275eae2e7a094df7a29d0dfece82b441d29100e852980143cd86b9a7e1d84f1d`.

### Bytes 8884-8964

Column1 name page111, rows[222,224): 16 bytes at8884 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at8900 contains 64 concatenated ASCII bytes for "value-0222-deterministic-fixture" / "value-0223-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:8884-8964. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `dfc5426f86816b0b6e7c0713e56aead20007059df3482ba6be9e63b128f7820a`.

### Bytes 8964-9012

Column1 name page112, rows[224,226): 16 bytes at8964 store 2 little-endian UInt64 cumulative end offsets [33,32]. Binary null_adjustment=33; subtract it from raw values >=33, yielding [0,32]. Buffer1 at8980 contains 32 concatenated ASCII bytes for null / "value-0225-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:8964-9012. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `44e96d3f4e8562fa52e7c32259305fd3c2c86d7a8ce945ecbe7c9d987b994e13`.

### Bytes 9012-9092

Column1 name page113, rows[226,228): 16 bytes at9012 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at9028 contains 64 concatenated ASCII bytes for "value-0226-deterministic-fixture" / "value-0227-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:9012-9092. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `d6e089a75b25d21ab37e70751d82e4bae08879b2da1e7fb60c2942e474b8684d`.

### Bytes 9092-9172

Column1 name page114, rows[228,230): 16 bytes at9092 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at9108 contains 64 concatenated ASCII bytes for "value-0228-deterministic-fixture" / "value-0229-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:9092-9172. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `02354f47c354f6f9ae6da67493154db037e48563cb231491ab3ec5096e1c20ad`.

### Bytes 9172-9220

Column1 name page115, rows[230,232): 16 bytes at9172 store 2 little-endian UInt64 cumulative end offsets [32,65]. Binary null_adjustment=33; subtract it from raw values >=33, yielding [32,32]. Buffer1 at9188 contains 32 concatenated ASCII bytes for "value-0230-deterministic-fixture" / null; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:9172-9220. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `1ba8d05962ac5e920d6b45b448fe437bc40cf1364674fe25cff1f6e879eed6d7`.

### Bytes 9220-9300

Column1 name page116, rows[232,234): 16 bytes at9220 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at9236 contains 64 concatenated ASCII bytes for "value-0232-deterministic-fixture" / "value-0233-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:9220-9300. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `072928ef10a316eee1a130050372e50b3f3c1e710afe6be1fd42d4cfefa86ed0`.

### Bytes 9300-9380

Column1 name page117, rows[234,236): 16 bytes at9300 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at9316 contains 64 concatenated ASCII bytes for "value-0234-deterministic-fixture" / "value-0235-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:9300-9380. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `436893ef3a65197eb9b5a171cb33c10de811638eed1ab5c5452316fda8a54228`.

### Bytes 9380-9460

Column1 name page118, rows[236,238): 16 bytes at9380 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at9396 contains 64 concatenated ASCII bytes for "value-0236-deterministic-fixture" / "value-0237-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:9380-9460. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `31667509f4ad7efdd642f2a14f83aa633816e82deeb148588f02913bd2b5925e`.

### Bytes 9460-9508

Column1 name page119, rows[238,240): 16 bytes at9460 store 2 little-endian UInt64 cumulative end offsets [33,32]. Binary null_adjustment=33; subtract it from raw values >=33, yielding [0,32]. Buffer1 at9476 contains 32 concatenated ASCII bytes for null / "value-0239-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:9460-9508. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `4553d535ca9ff9f84b8eb106d9feeb33c87e68b4823d3ecf904e64dbe11fcddf`.

### Bytes 9508-9588

Column1 name page120, rows[240,242): 16 bytes at9508 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at9524 contains 64 concatenated ASCII bytes for "value-0240-deterministic-fixture" / "value-0241-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:9508-9588. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `4865a842f8c8f10f9cbc94680ab6a4a7415f52fbd97a10b849df7e029d149f61`.

### Bytes 9588-9668

Column1 name page121, rows[242,244): 16 bytes at9588 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at9604 contains 64 concatenated ASCII bytes for "value-0242-deterministic-fixture" / "value-0243-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:9588-9668. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `1a56ca62a76e8ed9589b086ed3d8622b184bb0ee4aa84dab8627c9171641e460`.

### Bytes 9668-9716

Column1 name page122, rows[244,246): 16 bytes at9668 store 2 little-endian UInt64 cumulative end offsets [32,65]. Binary null_adjustment=33; subtract it from raw values >=33, yielding [32,32]. Buffer1 at9684 contains 32 concatenated ASCII bytes for "value-0244-deterministic-fixture" / null; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:9668-9716. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `1e7d674086e148d0da1546062a8ae202168ffab3c17e5b2a361456bb44a283c9`.

### Bytes 9716-9796

Column1 name page123, rows[246,248): 16 bytes at9716 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at9732 contains 64 concatenated ASCII bytes for "value-0246-deterministic-fixture" / "value-0247-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:9716-9796. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `c71027dad4eb0c5532a76fc4f914ab996466c6ea06a941f3c36905eaaf5ed419`.

### Bytes 9796-9876

Column1 name page124, rows[248,250): 16 bytes at9796 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at9812 contains 64 concatenated ASCII bytes for "value-0248-deterministic-fixture" / "value-0249-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:9796-9876. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `9af339eb68dac7b2c98b93b32d877f506e18e20f9ecc8bb8cdda45c8e63edf66`.

### Bytes 9876-9956

Column1 name page125, rows[250,252): 16 bytes at9876 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at9892 contains 64 concatenated ASCII bytes for "value-0250-deterministic-fixture" / "value-0251-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:9876-9956. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `d0ed5cea10691689074a74e745c8ea69194bf0f45ed5acb8bd0807cf6f477020`.

### Bytes 9956-10004

Column1 name page126, rows[252,254): 16 bytes at9956 store 2 little-endian UInt64 cumulative end offsets [33,32]. Binary null_adjustment=33; subtract it from raw values >=33, yielding [0,32]. Buffer1 at9972 contains 32 concatenated ASCII bytes for null / "value-0253-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:9956-10004. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `12c32cb71ccbb00fcc1039fbe8befd4c3c8265372ba26cd7323d514e618b39a2`.

### Bytes 10004-10084

Column1 name page127, rows[254,256): 16 bytes at10004 store 2 little-endian UInt64 cumulative end offsets [32,64]. Binary null_adjustment=65; subtract it from raw values >=65, yielding [32,64]. Buffer1 at10020 contains 64 concatenated ASCII bytes for "value-0254-deterministic-fixture" / "value-0255-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:10004-10084. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `41c32f324f012fca3695a6295a0d59ffe670191078d1cf028d4754c8b9c3c5fa`.

### Bytes 10084-10124

Column1 name page128, rows[256,257): 8 bytes at10084 store 1 little-endian UInt64 cumulative end offsets [32]. Binary null_adjustment=33; subtract it from raw values >=33, yielding [32]. Buffer1 at10092 contains 32 concatenated ASCII bytes for "value-0256-deterministic-fixture"; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:10084-10124. Interpretation: rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107. SHA-256: `c72fde98e928537c7ef191d253174c67c829ab9eb217c8c15dbbb21a2adb7aa1`.

### Bytes 10124-11236

Column0 metadata protobuf, 1112 bytes. Leading43 bytes: tag1 Encoding -> tag2 DirectEncoding -> tag1 bytes containing google.protobuf.Any; Any type_url=/lance.encodings.ColumnEncoding and value=0a00 (ColumnEncoding.values present empty). Follow 17 tag2 Page messages in column order. Each page has packed tag1 absolute buffer_offsets, packed tag2 byte buffer_sizes, tag3 logical length, tag4 direct Any type_url=/lance.encodings.ArrayEncoding and nested encoding. Priority tag5 is omitted/default0; column buffer offsets/sizes are absent. ArrayEncoding tag2 Nullable -> tag1 NoNull -> tag1 values -> ArrayEncoding tag1 Flat; Flat bits_per_value32 and an explicitly present empty Buffer (page0 by defaults). First two page records occupy62 bytes each, remaining15 occupy63 because offset varints grow. The final page length1 has four data bytes. The complete page catalog records every page's byte interval, row range, buffer offsets/sizes and values. No schema, per-column framing prefix, deferred encoding, extra field or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:10124-11236. Interpretation: protos/file2.proto:138-216; protos/encodings_v2_0.proto:308-358; rust/lance-file/src/versions/v2_0/writer.rs:875-925. SHA-256: `74519c7aa294f2d84e807a5e1170271a939422d4eea9dd456b8d7035c46d0a59`.

### Bytes 11236-22889

Column1 metadata protobuf, 11653 bytes. Leading43 bytes: tag1 Encoding -> tag2 DirectEncoding -> tag1 bytes containing google.protobuf.Any; Any type_url=/lance.encodings.ColumnEncoding and value=0a00 (ColumnEncoding.values present empty). Follow 129 tag2 Page messages in column order. Each page has packed tag1 absolute buffer_offsets, packed tag2 byte buffer_sizes, tag3 logical length, tag4 direct Any type_url=/lance.encodings.ArrayEncoding and nested encoding. Priority tag5 is omitted/default0; column buffer offsets/sizes are absent. ArrayEncoding tag6 Binary: tag1 indices is Nullable/NoNull/Flat64/page0; tag2 bytes is Flat8/page1 with Compression scheme none; tag3 null_adjustment is33 or65 according to page byte payload. Each of129 page records occupies90 bytes including its outer page tag/length; final page length1 uses one8-byte offset and32 data bytes. The complete page catalog records every page's byte interval, row range, buffer offsets/sizes and values. No schema, per-column framing prefix, deferred encoding, extra field or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:11236-22889. Interpretation: protos/file2.proto:138-216; protos/encodings_v2_0.proto:308-358; rust/lance-file/src/versions/v2_0/writer.rs:875-925. SHA-256: `57f866ac6dbe464eaf014fab894316432ba5338c56f86db5e54be261281946f3`.

### Bytes 22889-22905

CMO entry0: unsigned little-endian u64 metadata position10124, then u64 byte size1112; selects column0 only. The two entries are contiguous, with no count prefix or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:22889-22905. Interpretation: protos/file2.proto:40-93; rust/lance-file/src/versions/v2_0/writer.rs:927-951. SHA-256: `75fb86f2994c8b8fefc458ed6f36ff95936aed78f3111d76aa65fc73da9a3cf5`.

### Bytes 22905-22921

CMO entry1: unsigned little-endian u64 metadata position11236, then u64 byte size11653; selects column1 only. The two entries are contiguous, with no count prefix or padding.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:22905-22921. Interpretation: protos/file2.proto:40-93; rust/lance-file/src/versions/v2_0/writer.rs:927-951. SHA-256: `3c3a223fe153cd235e01fed6bb0b28157001c5b45f23608ebacf4bcc31fd2bee`.

### Bytes 22921-22929

Unsigned little-endian u64 A=10124: first column metadata position, after data.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:22921-22929. Interpretation: protos/file2.proto:40-93; rust/lance-file/src/versions/v2_0/writer.rs:927-951. SHA-256: `b2c8c3bc47abcdd1cf1e177cdcd2cbc9c10d61bfa1fa4fa73df16d8453eb3227`.

### Bytes 22929-22937

Unsigned little-endian u64 B=22889: two-entry column metadata offset table.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:22929-22937. Interpretation: protos/file2.proto:40-93; rust/lance-file/src/versions/v2_0/writer.rs:927-951. SHA-256: `623567736edacede7d0a7a995065ddc40fc45a8e6ef82a29171fbe18d5e7979c`.

### Bytes 22937-22945

Unsigned little-endian u64 C=22921: empty GBO table, coincident with footer start.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:22937-22945. Interpretation: protos/file2.proto:40-93; rust/lance-file/src/versions/v2_0/writer.rs:927-951. SHA-256: `ae2a6cc5fab3a2aab16f70ab12c8a6ef385f68c16b8f77d095335d1afc4baa6a`.

### Bytes 22945-22949

Unsigned little-endian u32 global-buffer count=0. Mini mode has no embedded schema/row-count descriptor; caller must supply the matching schema.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:22945-22949. Interpretation: protos/file2.proto:40-93; rust/lance-file/src/versions/v2_0/writer.rs:927-951. SHA-256: `df3f619804a92fdb4057192dc43dd748ea778adc52bc498ce80524c014b81119`.

### Bytes 22949-22953

Unsigned little-endian u32 physical column count=2; file has id and name columns only.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:22949-22953. Interpretation: protos/file2.proto:40-93; rust/lance-file/src/versions/v2_0/writer.rs:927-951. SHA-256: `26b25d457597a7b0463f9620f666dd10aa2c4373a505967c7c8d70922a2d6ece`.

### Bytes 22953-22955

Unsigned little-endian u16 major=2. This belongs to embedded V2_0 footer pair(2,0), distinct from standard V2_0 pair(0,3).

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:22953-22955. Interpretation: protos/file2.proto:40-93; rust/lance-file/src/versions/v2_0/writer.rs:927-951. SHA-256: `99be5efb88ca2013bd8e4eb035fd42d5245468fe9afa70d8ba9c1c419a48c4e8`.

### Bytes 22955-22957

Unsigned little-endian u16 minor=0. Exact version dispatch treats pair(2,0) as V2_0.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:22955-22957. Interpretation: protos/file2.proto:40-93; rust/lance-file/src/versions/v2_0/writer.rs:927-951. SHA-256: `96a296d224f285c67bee93c30f8a309157f0daa35dc5b87e410b78630a09cfc7`.

### Bytes 22957-22961

ASCII bytes 4c414e43 (LANC), closing the 40-byte footer and the complete file. No checksum or trailing bytes.

Evidence: rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:22957-22961. Interpretation: protos/file2.proto:40-93; rust/lance-file/src/versions/v2_0/writer.rs:927-951. SHA-256: `5609a82c090928a0a3046f3a4fec723cadc10dc7871754af674962ef39139219`.
