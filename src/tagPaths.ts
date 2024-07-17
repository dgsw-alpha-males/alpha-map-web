export enum Tag {
    물부족 = '물부족',
    여성 = '여성',
    에이즈 = '에이즈',
    '해양 생태계' = '해양 생태계',
    '지구 온난화' = '지구 온난화',
    석유 = '석유',
    세계화 = '세계화',
    빈곤 = '빈곤',
    생물다양성 = '생물다양성',
    '올바른 과학의 발전' = '올바른 과학의 발전',
    '플라스틱' = '플라스틱',
    '원조' = '원조',
    '국가권력' = '국가권력',
    도시화 = '도시화',
    이주 = '이주',
    주거 = '주거'
}

const tagPaths: { [key in string]: string } = {
    [Tag.물부족]: './models/물방울.glb',
    [Tag.여성]: './models/여성.glb',
    [Tag.에이즈]: './models/바이러스.glb',
    // [Tag.에이즈]: '',
    [Tag['해양 생태계']]: './models/해양생태계.glb',
    [Tag['지구 온난화']]: './models/지구온난화.glb',
    // [Tag.석유]: '',
    [Tag.석유]: './models/드럼통.glb',
    [Tag.세계화]: './models/국기.glb',
    [Tag.빈곤]: './models/식량.glb',
    [Tag.생물다양성]: './models/나무.glb',
    [Tag['올바른 과학의 발전']]: './models/neclear.glb',
    [Tag.플라스틱]: './models/플라스틱.glb',
    [Tag.원조]: './models/원조.glb',
    [Tag.국가권력]: './models/탱크.glb',
    [Tag.도시화]: './models/도시화.glb',
    [Tag.이주]: '',
    [Tag.주거]: './models/주거.glb'
};

const tagScales: { [key in string]: number } = {
    [Tag.물부족]: 0.3,
    [Tag.여성]: 10,
    [Tag.에이즈]: 7,
    [Tag['해양 생태계']]: 12,
    [Tag['지구 온난화']]: 8,
    // [Tag.석유]: '',
    [Tag.석유]: 8,
    [Tag.세계화]: 3,
    [Tag.빈곤]: 4,
    [Tag.생물다양성]: 1,
    [Tag['올바른 과학의 발전']]: 6,
    [Tag.플라스틱]: 5,
    [Tag.원조]: 1,
    [Tag.국가권력]: 3,
    [Tag.도시화]: 4,
    [Tag.이주]: 1,
    [Tag.주거]: 2
};

const tagAlt: { [key in string]: number } = {
    [Tag.물부족]: 0,
    [Tag.여성]: 0,
    [Tag.에이즈]: 0,
    [Tag['해양 생태계']]: 0,
    [Tag['지구 온난화']]: -0.03,
    // [Tag.석유]: '',
    [Tag.석유]: 0,
    [Tag.세계화]: 0,
    [Tag.빈곤]: 0,
    [Tag.생물다양성]: 0,
    [Tag['올바른 과학의 발전']]: 0.1,
    [Tag.플라스틱]: 0,
    [Tag.원조]: 0,
    [Tag.국가권력]: 0,
    [Tag.도시화]: 0,
    [Tag.이주]: 0,
    [Tag.주거]: 0
};

export {
    tagScales,
    tagAlt
};
export default tagPaths;