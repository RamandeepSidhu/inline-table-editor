import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent  implements OnInit {
  isEditing: boolean = false;
  removeClient: boolean = false;
  usersArray: any = [
    {
      id: 1,
      name: 'Leanne Graham',
      email: 'Sincere@april.biz',
      phone: '1-770-736-8031 x56442',
      linkedin: 'hildegard.org',
      country: 'Us',
      platform: '-',
      lead_score: '-',
      conversion: '-',
      isEdit: false,
    },
    {
      id: 2,
      name: 'Ervin Howell',
      username: 'Antonette',
      email: 'Shanna@melissa.tv',
      phone: '010-692-6593 x09125',
      linkedin: 'anastasia.net',
      country: 'Us',
      platform: 'facebook',
      lead_score: '-',
      conversion: '-',
      isEdit: false,
    },
    {
      id: 3,
      name: 'Clementine Bauch',
      username: 'Samantha',
      email: 'Nathan@yesenia.net',
      phone: '1-463-123-4447',
      linkedin: 'ramiro.info',
      country: 'Us',
      platform: 'facebook',
      lead_score: '0',
      conversion: '-',
      isEdit: false,
    },
    {
      id: 4,
      name: 'Patricia Lebsack',
      username: 'Karianne',
      email: 'Julianne.OConner@kory.org',
      phone: '493-170-9623 x156',
      linkedin: 'kale.biz',
      country: 'Us',
      platform: 'facebook',
      lead_score: '0',
      conversion: '-',
      isEdit: false,
    },
    {
      id: 5,
      name: 'Chelsey Dietrich',
      username: 'Kamren',
      email: 'Lucio_Hettinger@annie.ca',
      phone: '(254)954-1289',
      linkedin: 'demarco.info',
      country: 'Us',
      platform: 'facebook',
      lead_score: '-',
      conversion: '-',
      isEdit: false,
    },
    {
      id: 6,
      name: 'Mrs. Dennis Schulist',
      username: 'Leopoldo_Corkery',
      email: 'Karley_Dach@jasper.info',
      phone: '1-477-935-8478 x6430',
      linkedin: 'ola.org',
      country: 'Us',
      platform: 'facebook',
      lead_score: '-',
      conversion: '-',
      isEdit: false,
    },
    {
      id: 7,
      name: 'Kurtis Weissnat',
      username: 'Elwyn.Skiles',
      email: 'Telly.Hoeger@billy.biz',
      phone: '210.067.6132',
      linkedin: 'elvis.io',
      country: 'Us',
      platform: 'facebook',
      lead_score: '-',
      conversion: '-',
      isEdit: false,
    },
    {
      id: 8,
      name: 'Nicholas Runolfsdottir V',
      username: 'Maxime_Nienow',
      email: 'Sherwood@rosamond.me',
      phone: '586.493.6943 x140',
      linkedin: 'jacynthe.com',
      country: 'Us',
      platform: 'facebook',
      lead_score: '-',
      conversion: '-',
      isEdit: false,
    },
    {
      id: 9,
      name: 'Glenna Reichert',
      username: 'Delphine',
      email: 'Chaim_McDermott@dana.io',
      phone: '(775)976-6794 x41206',
      linkedin: 'conrad.com',
      country: 'Us',
      platform: 'facebook',
      lead_score: '-',
      conversion: '-',
      isEdit: false,
    },
    {
      id: 10,
      name: 'Clementina DuBuque',
      username: 'Moriah.Stanton',
      email: 'Rey.Padberg@karina.biz',
      phone: '024-648-3804',
      linkedin: 'ambrose.net',
      country: 'Us',
      platform: 'facebook',
      lead_score: '-',
      conversion: '-',
      isEdit: false,
    },
    {
      id: 7,
      name: 'Kurtis Weissnat',
      username: 'Elwyn.Skiles',
      email: 'Telly.Hoeger@billy.biz',
      phone: '210.067.6132',
      linkedin: 'elvis.io',
      country: 'Us',
      platform: 'facebook',
      lead_score: '-',
      conversion: '-',
      isEdit: false,
    },
    {
      id: 8,
      name: 'Nicholas Runolfsdottir V',
      username: 'Maxime_Nienow',
      email: 'Sherwood@rosamond.me',
      phone: '586.493.6943 x140',
      linkedin: 'jacynthe.com',
      country: 'Us',
      platform: 'facebook',
      lead_score: '-',
      conversion: '-',
      isEdit: false,
    },
    {
      id: 9,
      name: 'Glenna Reichert',
      username: 'Delphine',
      email: 'Chaim_McDermott@dana.io',
      phone: '(775)976-6794 x41206',
      linkedin: 'conrad.com',
      country: 'Us',
      platform: 'facebook',
      lead_score: '-',
      conversion: '-',
      isEdit: false,
    },
    {
      id: 10,
      name: 'Clementina DuBuque',
      username: 'Moriah.Stanton',
      email: 'Rey.Padberg@karina.biz',
      phone: '024-648-3804',
      linkedin: 'ambrose.net',
      country: 'Us',
      platform: 'facebook',
      lead_score: '-',
      conversion: '-',
      isEdit: false,
    },
    {
      id: 7,
      name: 'Kurtis Weissnat',
      username: 'Elwyn.Skiles',
      email: 'Telly.Hoeger@billy.biz',
      phone: '210.067.6132',
      linkedin: 'elvis.io',
      country: 'Us',
      platform: 'facebook',
      lead_score: '-',
      conversion: '-',
      isEdit: false,
    },
    {
      id: 8,
      name: 'Nicholas Runolfsdottir V',
      username: 'Maxime_Nienow',
      email: 'Sherwood@rosamond.me',
      phone: '586.493.6943 x140',
      linkedin: 'jacynthe.com',
      country: 'Us',
      platform: 'facebook',
      lead_score: '-',
      conversion: '-',
      isEdit: false,
    },
    {
      id: 9,
      name: 'Glenna Reichert',
      username: 'Delphine',
      email: 'Chaim_McDermott@dana.io',
      phone: '(775)976-6794 x41206',
      linkedin: 'conrad.com',
      country: 'Us',
      platform: 'facebook',
      lead_score: '-',
      conversion: '-',
      isEdit: false,
    },
    {
      id: 10,
      name: 'Clementina DuBuque',
      username: 'Moriah.Stanton',
      email: 'Rey.Padberg@karina.biz',
      phone: '024-648-3804',
      linkedin: 'ambrose.net',
      country: 'Us',
      platform: 'facebook',
      lead_score: '-',
      conversion: '-',
      isEdit: false,
    },
  ];
  constructor() {}

  ngOnInit(): void {}
  onEdit(item: any) {
    this.cancelEdit();
    this.usersArray.forEach((element: any) => {
      element.isEdit = false;
    });
    item.isEdit = true;
  }
  addNewRecord(): void {
    const newRecord = {
      name: '',
      email: '',
      phone: '',
      linkedin: '',
      country: '',
      platform:'',
      lead_score:'',
      conversion:'',
      isEdit: true,
    };

    this.usersArray.unshift(newRecord);
  }
  removeRecord() {
    this.cancelEdit();
    this.removeClient = false;
  }
  cancelEdit(): void {
    this.usersArray.forEach((element: any) => {
      element.isEdit = false;
    });

    this.isEditing = false;
  }
}
