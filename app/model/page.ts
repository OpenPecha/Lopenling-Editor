import { fullSearch } from '~/lib';
import { db } from '~/services/db.server';

export async function getPageWithId(id: string) {
  try {
    let page = db.page.findFirst({
      where: {
        id,
      },
      include: {
        text: {
          include: {
            Page: true,
          },
        },
      },
    });
    return page;
  } catch (e) {
    console.log(e);
  }
}
export async function getVersions(textId: number, order: number) {
  
  try {
    let page = db.page.findMany({
      where: {
        textId,
        order,
      },
      select: {
        version: true,
      },
    });
    let filterpage = await page;
    if (filterpage.filter(l=>l.version!==null).length==0) return [];
    return (await page).map(item=>item?.version);
  } catch (e) {
    console.log(e);
  }
}

export async function getPage(textId: number, order: number,version:string|null) {
  try {
    let where = typeof version==='string' ? { textId, order, version } : { textId, order };
    let pageWhere = version ? { version } : {};
    let page = db.page.findFirst({
      where,
      include: {
        text: {
          include: {
            Page: {
              where: pageWhere,
             select: {
                id: true,
                order: true,
             }
            },
          },
        },
        Post: {
          select: {
           id: true,
          }
        },
      },
    });
    return page;
  } catch (e) {
    console.log(e);
  }
}
export async function getPageId(textId: number, order: number) {
  try {
    let page = await db.page.findFirst({
      where: {
        textId,
        order,
      },
    });
    return page?.id;
  } catch (e) {
    console.log(e);
  }
}
export async function searchPages(search_term = '') {
  try {
    const textList = await db.page.findMany({
      include: {
        text: true,
      },
    });
    let results = fullSearch(textList, search_term);
    let groupedData = [];

    for (const item of results) {
      const { textId } = item;
      const existingGroup = groupedData.find((group) => group.textId === textId);
      if (existingGroup) {
        existingGroup.results.push(item);
      } else {
        groupedData.push({
          textId: textId,
          results: [item],
          textName:item.name
        });
      }
    }
    return Object.values(groupedData).map((value) => ({
      results: value.results,
      textId: value.textId,
    }));
  } catch (e: any) {
    throw new Error('error finding text with name' + e.message);
  }
}
export async function updatePage(pageId: string, content: string) {
  try {
    let res = db.page.update({
      data: {
        content,
      },
      where: {
        id: pageId,
      },
    });
    return res;
  } catch (e: any) {
    throw new Error('update text error' + e.message);
  }
}
