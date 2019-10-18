import { decorate, observable, action } from 'mobx';

class TagsStore {
  tags = [];

  setTags = (tags) => {
    this.tags = tags;
  }

  clearTags = () => {
    this.tags = [];
  }

  addTag = (tag) => {
    const { id, name } = tag;
    this.tags.push({ id, name });
  }

  removeTag = (id) => {
    this.tags = this.tags.filter((tag) => tag.id !== id);
  }
}

decorate(TagsStore, {
  tags: observable,
  setTags: action,
  clearTags: action,
  addTag: action,
  removeTag: action,
});

const tagsStore = new TagsStore();
export default tagsStore;
